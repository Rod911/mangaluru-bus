<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Http\Requests\Admin\Location\DestroyLocationRequest;
use App\Http\Requests\Admin\Location\StoreLocationRequest;
use App\Http\Requests\Admin\Location\UpdateLocationRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class LocationController extends Controller {
    public function index() {
        return Inertia::render('admin/locations/Locations');
    }

    public function paginateLocations(Request $request) {
        $page = $request->page ?? 1;
        $pageSize = $request->pageSize ?? 10;
        $query = $request->search ?? '';
        $locations = Location::orderBy('location_name')
            ->limit($pageSize)
            ->offset(($page - 1) * $pageSize)
            ->where('location_name', 'like', '%' . $query . '%')
            ->get();
        return response()->json([
            'data' => $locations,
            'pagination' => [
                'total' => Location::where('location_name', 'like', '%' . $query . '%')->count(),
                'current_page' => (int) $page,
                'per_page' => (int) $pageSize
            ]
        ]);
    }

    public function create() {
        return Inertia::render('admin/locations/LocationsCreate');
    }

    public function store(StoreLocationRequest $request) {
        $request->validate([
            'locationName' => [
                Rule::unique(Location::class, 'location_name'),
            ]
        ]);

        $location = Location::create([
            'location_name' => $request->locationName,
            'address' => $request->locationAddress,
        ]);
        foreach (($request->busStops ?? []) as $stop) {
            $stop_data = [
                'stop_description' => trim($stop['stop_description']),
                'is_two_way' => $stop['is_two_way'],
            ];
            $newStops = $location->busStops()->create($stop_data);
        }

        return redirect(route('locations.view'));
    }

    public function edit(Request $request) {
        $location = Location::findOrFail($request->uuid)->load('busStops');
        return Inertia::render('admin/locations/LocationsCreate', [
            'location' => $location
        ]);
    }

    public function update(UpdateLocationRequest $request) {
        $location = Location::findOrFail($request->uuid)->load('busStops');
        $request->validate([
            'locationName' => [
                Rule::unique(Location::class, 'location_name')->ignore($location->uuid, 'uuid'),
            ],
        ]);

        $location->update([
            'location_name' => trim($request->locationName),
            'address' => trim($request->locationAddress),
        ]);

        $existingStops = $location->busStops->keyBy('uuid');
        $updatedUuids = [];
        foreach ($request->busStops as $stop) {
            $stop_data = [
                'stop_description' => trim($stop['stop_description']),
                'is_two_way' => $stop['is_two_way'],
            ];
            if (isset($stop['uuid']) && $existingStops->has($stop['uuid'])) {
                $existingStops->get($stop['uuid'])->update($stop_data);
                $updatedUuids[] = $stop['uuid'];
            } else {
                $newStops = $location->busStops()->create($stop_data);
                $updatedUuids[] = $newStops->uuid;
            }
        }
        $location->busStops()
            ->whereNotIn('uuid', $updatedUuids)
            ->delete();

        return redirect(route('locations.view'));
    }

    public function destroy(DestroyLocationRequest $request) {
        $location = Location::find($request->uuid);
        $location->delete();
        return redirect(route('locations.view'));
    }
}
