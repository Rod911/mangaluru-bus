<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use App\Models\Location;
use App\Models\Route;
use App\Models\RouteStop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        if ($from == $to) {
            return Inertia::render('SearchErrorPage', [
                'app_name' => env('APP_NAME'),
                'error' => 'From and To location cannot be the same',
            ]);
        }
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
        $indirectRoutes = [];
        $intersectStops = [];
        $intersectStopsDetails = [];
        if (count($routes) < 5) {
            $sourceBus = Route::select('routes.*', 'route_stops.order as boardingPoint')
                ->join('route_stops', 'route_stops.route_id', '=', 'routes.uuid')
                ->where('route_stops.location_id', $from)
                ->groupBy('routes.uuid')
                ->orderByRaw('CAST(SUBSTR(routes.route_name, 1, INSTR(routes.route_name || "A", "A")-1) AS INTEGER)')
                ->get()
                ->load(['routeStops' => function ($query) {
                    $query->orderBy('order', 'asc');
                }, 'routeStops.location']);
            $destBus = Route::select('routes.*', 'route_stops.order as boardingPoint')
                ->join('route_stops', 'route_stops.route_id', '=', 'routes.uuid')
                ->where('route_stops.location_id', $to)
                ->groupBy('routes.uuid')
                ->orderByRaw('CAST(SUBSTR(routes.route_name, 1, INSTR(routes.route_name || "A", "A")-1) AS INTEGER)')
                ->get()
                ->load(['routeStops' => function ($query) {
                    $query->orderBy('order', 'asc');
                }, 'routeStops.location']);

            foreach ($sourceBus as &$routeA) {
                // $routeA->boardingPoint
                $stops = [];
                $stopsDetails = [];
                foreach ($destBus as $routeB) {
                    foreach ($routeA->routeStops as $stopA) {
                        foreach ($routeB->routeStops as $stopB) {
                            if (
                                $stopA->location_id === $stopB->location_id
                                && !in_array($stopA->location_id, $stops)
                                && $stopA->location_id !== $from
                                && $stopB->location_id !== $from
                                && $stopA->location_id !== $from
                                && $stopB->location_id !== $from
                            ) {
                                $stops[] = $stopA->location_id;
                                $stopsDetails[] = $stopA;
                                if (!in_array($stopA->location_id, $intersectStops)) {
                                    $intersectStops[] = $stopA->location_id;
                                    $intersectStopsDetails[] = $stopA;
                                }
                            }
                        }
                    }
                }
                if (count($stops) > 0) {
                    $indirectRoutes[] = ['route' => $routeA, 'switchingPoints' => $stopsDetails];
                }
            }
        }
        return Inertia::render('SearchResultsPage', [
            'app_name' => env('APP_NAME'),
            'from' => $fromLocation,
            'to' => $toLocation,
            'routes' => $routes,
            'indirectRoutes' => $indirectRoutes,
            'intersectStops' => $intersectStopsDetails,
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
            $path = $request->file('photo')->store('issue-photos', 'public');
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
