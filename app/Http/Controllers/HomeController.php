<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use App\Models\Location;
use App\Models\Route;
use App\Models\SearchLog;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\File;
use Inertia\Inertia;

class HomeController extends Controller {
    public function index() {
        $locations = Location::orderBy('location_name')->get();
        $popularLocations = SearchLog::where('type', 'location')
            ->groupBy('from', 'to')
            ->orderBy(DB::raw('count(DISTINCT ip)'), 'desc')->limit(5)->get()
            ->load([
                'fromLocation',
                'toLocation',
            ]);
        $popularRoutes = SearchLog::where('type', 'route')
            ->groupBy('route')
            ->join('routes', function ($join) {
                $join->on('routes.route_name', 'LIKE', DB::raw('"%" || search_logs.route || "%"'));
            })
            ->orderBy(DB::raw('count(DISTINCT ip)'), 'desc')->limit(5)->get();
        return Inertia::render('Welcome', [
            'app_name' => env('APP_NAME'),
            'locations' => $locations,
            'popularLocations' => $popularLocations,
            'popularRoutes' => $popularRoutes,
        ]);
    }

    public function search(Request $request) {
        $type  = $request->query('type');
        $from  = $request->query('from');
        $to  = $request->query('towards');
        $route = $request->query('route');

        SearchLog::create([
            'type' => $type,
            'from' => $from ?? "",
            'to' => $to ?? "",
            'route' => $route ?? "",
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        if ($type == 'location') {
            return $this->_locationSearch($from, $to);
        }
        return $this->_routeSearch($route);
    }

    public function routes(Request $request, $slugFrom = null, $slugTo = null) {
        SearchLog::create([
            'type' => 'location',
            'from' => $slugFrom,
            'to' => $slugTo,
            'route' => '',
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return $this->_locationSearch($slugFrom, $slugTo);
    }

    public function routeSearch($route) {
        SearchLog::create([
            'type' => 'route',
            'from' => '',
            'to' => '',
            'route' => $route,
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        return $this->_routeSearch($route);
    }

    private function _locationSearch($from, $to) {
        if ($from == $to) {
            return Inertia::render('SearchErrorPage', [
                'app_name' => env('APP_NAME'),
                'error' => 'From and To location cannot be the same',
            ]);
        }
        $fromLocation = Location::where('url_slug', $from)->first();
        $toLocation = Location::where('url_slug', $to)->first();
        $routes = Route::select('routes.*')
            ->selectRaw('GROUP_CONCAT(`route_stops`.`order`) as stop_order')
            ->join('route_stops', 'route_stops.route_id', '=', 'routes.uuid')
            ->whereIn('route_stops.location_id', [$fromLocation->uuid, $toLocation->uuid])
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
        $routeNames = array_column($routes->toArray(), 'route_name');
        $indirectRoutes = [];
        $intersectStops = [];
        $intersectStopsDetails = [];
        if (count($routes) < 3) {
            $sourceBus = Route::select('routes.*', 'route_stops.order as boardingPoint')
                ->join('route_stops', 'route_stops.route_id', '=', 'routes.uuid')
                ->where('route_stops.location_id', $fromLocation->uuid)
                ->whereNotIn('routes.route_name', $routeNames)
                ->groupBy('routes.uuid')
                ->orderByRaw('CAST(SUBSTR(routes.route_name, 1, INSTR(routes.route_name || "A", "A")-1) AS INTEGER)')
                ->get()
                ->load(['routeStops' => function ($query) {
                    $query->orderBy('order', 'asc');
                }, 'routeStops.location']);
            $destBus = Route::select('routes.*', 'route_stops.order as boardingPoint')
                ->join('route_stops', 'route_stops.route_id', '=', 'routes.uuid')
                ->where('route_stops.location_id', $toLocation->uuid)
                ->groupBy('routes.uuid')
                ->orderByRaw('CAST(SUBSTR(routes.route_name, 1, INSTR(routes.route_name || "A", "A")-1) AS INTEGER)')
                ->get()
                ->load([
                    'routeStops' => function ($query) {
                        $query->orderBy('order', 'asc');
                    },
                    'routeStops.location',
                    'routeStops.defaultBusStop',
                ]);

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
                                && $stopA->location_id !== $fromLocation->uuid
                                && $stopB->location_id !== $fromLocation->uuid
                                && $stopA->location_id !== $fromLocation->uuid
                                && $stopB->location_id !== $fromLocation->uuid
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

    private function _routeSearch($route) {
        $routes = Route::whereLike('route_name', '%' . $route . '%')
            ->orderByRaw('CAST(SUBSTR(route_name, 1, INSTR(route_name || "A", "A")-1) AS INTEGER)')
            ->orderBy('route_name')
            ->get()->load([
                'routeStops' => function ($query) {
                    $query->orderBy('order', 'asc');
                },
                'routeStops.location',
                'routeStops.defaultBusStop',
            ]);
        return Inertia::render('RouteResultsPage', [
            'app_name' => env('APP_NAME'),
            'query' => $route,
            'routes' => $routes,
        ]);
    }

    public function allLocations() {
        $locations = Location::orderBy('location_name')->get();
        return Inertia::render('AllLocationsPage', [
            'app_name' => env('APP_NAME'),
            'locations' => $locations,
        ]);
    }

    public function location(string $location) {
        $location = Location::where('url_slug', $location)->first()->load([
            'routes' => function ($query) {
                $query->orderByRaw('CAST(SUBSTR(routes.route_name, 1, INSTR(routes.route_name || "A", "A")-1) AS INTEGER)')
                    ->orderBy('route_name');
            },
            'routes.routeStops' => function ($query) {
                $query->orderBy('order', 'asc');
            },
            'routes.routeStops.location.busStops',
            'routes.routeStops.defaultBusStop',
            'routes.routeStops.busStop',
            'busStops'
        ]);
        return Inertia::render('LocationPage', [
            'app_name' => env('APP_NAME'),
            'location' => $location,
        ]);
    }

    public function allRoutes($type = null) {
        $where = '';
        $title = 'All Routes';
        switch ($type) {
            case 'local':
                $where = 'has_local';
                $title = 'Local Bus Routes';
                break;
            case 'express':
                $where = 'has_express';
                $title = 'Express Busses';
                break;
            case 'ksrtc':
                $where = 'has_govt';
                $title = 'KSRTC Busses';
                break;
            default:
                break;
        }
        $routes = Route::select('routes.*');
        if ($where !== '') {
            $routes->where($where, 1);
        }
        $routes = $routes
            ->orderByRaw('CAST(SUBSTR(route_name, 1, INSTR(route_name || "A", "A")-1) AS INTEGER)')
            ->orderBy('route_name')
            ->get()
            ->load([
                'routeStops' => function ($query) {
                    $query->orderBy('order', 'asc');
                },
                'routeStops.location',
                'routeStops.defaultBusStop',
            ]);
        return Inertia::render('AllRoutesPage', [
            'app_name' => env('APP_NAME'),
            'title' => $title,
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

    public function about() {
        return Inertia::render('AboutPage', [
            'app_name' => env('APP_NAME'),
        ]);
    }

    public function terms() {
        return Inertia::render('TermsPage', [
            'app_name' => env('APP_NAME'),
        ]);
    }

    public function privacy() {
        return Inertia::render('PrivacyPage', [
            'app_name' => env('APP_NAME'),
        ]);
    }

    public function migrate() {
        $locs = Location::get();
        foreach ($locs as $location) DB::table('locations')->where('uuid', $location->uuid)->update(['url_slug' => Str::of($location->location_name)->slug('-')]);
        SearchLog::where('type', 'location')->get()->load(['fromLocation', 'toLocation'])->each(function ($log) {
            if ($log->fromLocation->url_slug === null || $log->toLocation->url_slug === null) {
                throw new Exception('Location slugs not generated');
            }
            $log->update([
                'from' => $log->fromLocation->url_slug,
                'to' => $log->toLocation->url_slug,
            ]);
        });
    }
}
