<?php

namespace App\Http\Controllers;

use App\Models\Route;
use App\Models\Location;
use App\Http\Requests\Admin\Routes\StoreRouteRequest;
use App\Http\Requests\Admin\Routes\DestroyRouteRequest;
use App\Http\Requests\Admin\Routes\UpdateRouteRequest;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RouteController extends Controller {
    public function index() {
        return Inertia::render('admin/routes/Routes', [
            'routes' => Route::selectRaw('count(route_stops.route_id) as stop_count, routes.*')
                ->orderByRaw('CAST(SUBSTR(route_name, 1, INSTR(route_name || "A", "A")-1) AS INTEGER)')
                ->orderBy('route_name')
                ->join('route_stops', 'route_stops.route_id', '=', 'routes.uuid', 'left')
                ->groupBy('routes.uuid')
                ->get(),
        ]);
    }

    public function create() {
        return Inertia::render('admin/routes/RoutesCreate', [
            'locations' => Location::orderBy('location_name')->get()->load('busStops'),
        ]);
    }

    public function store(StoreRouteRequest $request) {
        $request->validate([
            'routeName' => [
                Rule::unique(Route::class, 'route_name'),
            ]
        ]);

        $route = Route::create([
            'route_name' => trim($request->routeName),
            'has_local' => $request->hasLocal,
            'has_govt' => $request->hasGovt,
            'has_express' => $request->hasExpress,
        ]);
        foreach ($request->routeStops as $si => $stop) {
            $stop_data = [
                'order' => $si,
                'route_id' => $route->uuid,
                'location_id' => $request->routeStops[$si]['location_id'],
                'bus_stop_id' => $request->routeStops[$si]['bus_stop_id'] ?? null,
            ];
            $newStop = $route->routeStops()->create($stop_data);
        }

        return redirect(route('routes.view'));
    }

    public function edit(Request $request) {
        $route = Route::findOrFail($request->uuid)->load(['routeStops' => function ($query) {
            $query->orderBy('order', 'asc');
        }, 'routeStops.location.busStops']);
        return Inertia::render('admin/routes/RoutesCreate', [
            'route' => $route,
            'locations' => Location::orderBy('location_name')->get()->load('busStops'),
        ]);
    }

    public function update(UpdateRouteRequest $request) {
        $route = Route::findOrFail($request->uuid)->load('routeStops');
        $request->validate([
            'routeName' => [
                Rule::unique(Route::class, 'route_name')->ignore($route->uuid, 'uuid'),
            ],
        ]);

        $route->update([
            'route_name' => trim($request->routeName),
            'has_local' => $request->hasLocal,
            'has_govt' => $request->hasGovt,
            'has_express' => $request->hasExpress,
        ]);

        $existingStops = $route->routeStops->keyBy('uuid');
        $route->routeStops()->delete();
        foreach ($request->routeStops as $si => $stop) {
            $stop_data = [
                'order' => $si,
                'route_id' => $route->uuid,
                'location_id' => $request->routeStops[$si]['location_id'],
                'bus_stop_id' => $request->routeStops[$si]['bus_stop_id'] ?? null,
            ];
            if (isset($stop['uuid']) && $existingStops->has($stop['uuid'])) {
                $existingStops->get($stop['uuid'])->update($stop_data);
            } else {
                $newStop = $route->routeStops()->create($stop_data);
            }
        }

        return redirect(route('routes.view'));
    }

    public function destroy(DestroyRouteRequest $request) {
        $route = Route::find($request->uuid);
        $route->delete();
        return redirect(route('routes.view'));
    }

    public function fill() {
        $data = json_decode('[]', true);

        DB::transaction(function () use ($data) {
            foreach ($data as $route) {
                $routeData = Route::where('route_name', $route['Route'])->first();
                if (!$routeData) {
                    throw new Exception('Route not found');
                }
                // die(json_encode($routeData->toArray()));
                $routeData->routeStops()->delete();
                foreach ($route['Stops'] as $si => $stop) {
                    $location = Location::where('location_name', $stop)->first();
                    // die(json_encode($location->toArray()));
                    if (!$location || !isset($location['uuid'])) {
                        throw new Exception('Location not found:' . $stop, 1);
                    }
                    $stop_data = [
                        'order' => $si,
                        'route_id' => $routeData['uuid'],
                        'location_id' => $location['uuid'],
                        'bus_stop_id' => null,
                    ];
                    $newStop = $routeData->routeStops()->create($stop_data);
                }
            }
        });
    }
}
