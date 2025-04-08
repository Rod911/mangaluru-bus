import { Head, Link } from "@inertiajs/react";
import Layout from "@/Components/Layout";
import { LocationDetails } from "@/types";
import RouteResults from "@/Components/home/RouteResults";
import LeafletMap from "@/Components/LeafletMap";

export default function LocationPage({
    app_name,
    location,
}: {
    app_name: string;
    location: LocationDetails;
}) {
    const routes = location.routes;
    const activeIndices = routes.map((route) =>
        route.route_stops.findIndex(
            (stop) => stop.location_id === location.uuid
        )
    );
    const mapMarkers = location.bus_stops
        .map((stop, posIndex) => {
            if (!stop.coordinates) return null;
            const activeStop = activeIndices?.[posIndex];
            return {
                pos: {
                    lat: stop.coordinates.latitude,
                    lng: stop.coordinates.longitude,
                },
                highlight: posIndex === activeStop,
                label: stop.stop_description,
            };
        })
        .filter((coord) => !!coord);
    const mapPaths = mapMarkers
        .map((stop, index, stops) => {
            if (index === stops.length - 1) return null;
            return {
                from: stop.pos,
                to: stops[index + 1].pos,
            };
        })
        .filter((path) => !!path);
    return (
        <Layout app_name={app_name}>
            <Head title={location.location_name + " busses"} />
            <div className="container mx-auto px-4 py-8">
                <section className="mb-6">
                    <h1 className="text-3xl font-bold">
                        {location.location_name}
                    </h1>
                    {location.address && (
                        <p className="text-lg">{location.address}</p>
                    )}
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-bold mb-3">
                        Busses available from this location
                    </h2>
                    <RouteResults
                        routes={routes}
                        activeIndices={activeIndices}
                    />
                </section>

                {location.bus_stops.length > 0 && (
                    <div
                        className="w-full rounded-lg overflow-hidden"
                        style={{ height: "30rem" }}
                    >
                        <LeafletMap
                            positions={mapMarkers}
                            paths={[]}
                            zoom={17}
                            mapKey={location.url_slug}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
}
