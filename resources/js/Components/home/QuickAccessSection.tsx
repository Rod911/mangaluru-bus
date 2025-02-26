import { PopularLocation } from "@/types";
import { Link } from "@inertiajs/react";
import {
    AlertTriangle,
    MapPin,
    Bus,
    BusFront,
    ListOrderedIcon,
} from "lucide-react";

export default function QuickAccessSection({
    popularLocations,
    popularRoutes,
}: {
    popularLocations: PopularLocation[];
    popularRoutes: PopularLocation[];
}) {
    return (
        <section className="">
            <h2 className="text-2xl font-bold mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <h3 className="font-bold mb-2 flex items-center">
                        <MapPin className="mr-2" size={20} />
                        Popular Location Searches
                    </h3>
                    <div className="grid md:grid-cols-1 gap-2">
                        {popularLocations.map((location, index) => (
                            <Link
                                key={index}
                                href={route("search", {
                                    from: location.from_location?.uuid,
                                    towards: location.to_location?.uuid,
                                    type: location.type,
                                })}
                                className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow duration-200"
                            >
                                <p className="text-gray-800 font-medium">
                                    {location.from_location?.location_name} to{" "}
                                    {location.to_location?.location_name}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <h3 className="font-bold mb-2 flex items-center">
                        <BusFront className="mr-2" size={20} />
                        Popular Routes Searches
                    </h3>
                    <div className="grid md:grid-cols-1 gap-2">
                        {popularRoutes.map((busRoute, index) => (
                            <Link
                                key={index}
                                href={route("search", {
                                    route: busRoute.route,
                                    type: busRoute.type,
                                })}
                                className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow duration-200"
                            >
                                <p className="text-gray-800 font-medium">
                                    {busRoute.route}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <h3 className="font-bold mb-2 flex items-center">
                        <ListOrderedIcon className="mr-2" size={20} />
                        Directory
                    </h3>
                    <div className="grid md:grid-cols-1 gap-2">
                        <Link
                            href={route("all-locations")}
                            className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow duration-200"
                        >
                            <p className="text-gray-800 font-medium">
                                All Locations
                            </p>
                        </Link>
                        <Link
                            href={route("all-routes")}
                            className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow duration-200"
                        >
                            <p className="text-gray-800 font-medium">
                                All Routes
                            </p>
                        </Link>
                        <Link
                            href={route("all-routes", { type: "local" })}
                            className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow duration-200"
                        >
                            <p className="text-gray-800 font-medium">
                                Local Routes
                            </p>
                        </Link>
                        <Link
                            href={route("all-routes", { type: "express" })}
                            className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow duration-200"
                        >
                            <p className="text-gray-800 font-medium">
                                Express Routes
                            </p>
                        </Link>
                        <Link
                            href={route("all-routes", { type: "ksrtc" })}
                            className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow duration-200"
                        >
                            <p className="text-gray-800 font-medium">
                                KSRTC Routes
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
