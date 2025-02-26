import { Head } from "@inertiajs/react";
import Layout from "@/Components/Layout";
import { IndirectRoute, Location, RouteResults, RouteStop } from "@/types";
import SearchResults from "@/Components/home/SearchResults";

export default function SearchResultsPage({
    app_name,
    from,
    to,
    routes,
    indirectRoutes,
    intersectStops,
}: {
    app_name: string;
    from: Location;
    to: Location;
    routes: RouteResults[];
    indirectRoutes: IndirectRoute[];
    intersectStops: RouteStop[];
}) {
    return (
        <Layout app_name={app_name}>
            <Head
                title={
                    from.location_name +
                    " To " +
                    to.location_name +
                    " in busses Mangaluru"
                }
            />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Search Results</h1>
                <div className="mb-4 flex justify-between items-center">
                    <p className="text-lg">
                        From: {from.location_name} | To: {to.location_name}
                    </p>
                </div>
                <SearchResults
                    routes={routes}
                    from={from}
                    to={to}
                    indirectRoutes={indirectRoutes}
                    intersectStops={intersectStops}
                />
            </div>
        </Layout>
    );
}
