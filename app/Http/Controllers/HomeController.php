<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use App\Models\Location;
use App\Models\Route;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\File;
use Inertia\Inertia;

class HomeController extends Controller {
    public function search(Request $request) {
        $type  = $request->query('type');
        $from  = $request->query('from');
        $to  = $request->query('towards');
        $route = $request->query('route');
        if ($type == 'location') {
            return $this->locationSearch($from, $to);
        }
        return $this->routeSearch($route);
    }

    private function locationSearch($from, $to) {
        $fromLocation = Location::where('uuid', $from)->first();
        $toLocation = Location::where('uuid', $to)->first();
        $routes = Route::select('routes.*')
            ->selectRaw('GROUP_CONCAT(`route_stops`.`order`) as stop_order')
            ->join('route_stops', 'route_stops.route_id', '=', 'routes.uuid')
            ->whereIn('route_stops.location_id', [$from, $to])
            ->groupBy('routes.uuid')
            ->orderByRaw('CAST(SUBSTR(routes.route_name, 1, INSTR(routes.route_name || "A", "A")-1) AS INTEGER)')
            ->orderBy('route_stops.order', 'asc')
            ->orderBy('stop_order', 'asc')
            ->havingRaw('(COUNT(route_stops.route_id)) = 2')
            ->get()
            ->load(['routeStops' => function ($query) {
                $query->orderBy('order', 'asc');
            }, 'routeStops.location']);
        foreach ($routes as &$route) {
            $route->stop_order = json_decode('[' . $route->stop_order . ']', true);
        }
        return Inertia::render('SearchResultsPage', [
            'app_name' => env('APP_NAME'),
            'from' => $fromLocation,
            'to' => $toLocation,
            'routes' => $routes,
        ]);
    }

    private function routeSearch($route) {
        $routes = Route::whereLike('route_name', '%' . $route . '%')->get()->load(['routeStops' => function ($query) {
            $query->orderBy('order', 'asc');
        }, 'routeStops.location']);
        return Inertia::render('RouteResultsPage', [
            'app_name' => env('APP_NAME'),
            'routes' => $routes,
        ]);
    }

    public function reportIssue() {
        return Inertia::render('ReportIssuePage', [
            'app_name' => env('APP_NAME'),
        ]);
    }

    public function storeReportIssue(Request $request) {
        $request->validate([
            'issueType' => 'required',
            'description' => 'required',
            'photo' => [
                'nullable',
                File::image()
                    ->max(5 * 1024),
            ],
            'contactInfo' => 'nullable',
        ]);
        // store issue
        // check file is not null
        $path = null;
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->storePublicly('issue-photos');
        }
        $issue = Issue::create([
            'type' => $request->issueType,
            'description' => $request->description,
            'image' => $path,
            'contact' => $request->contactInfo,
        ]);
        return Inertia::render('ReportIssuePage', [
            'app_name' => env('APP_NAME'),
            'response' => [
                'success' => true,
                'message' => 'Issue reported successfully',
            ],
        ]);
    }
}
