import { MapPin, BusFrontIcon, ExternalLink } from "lucide-react";
import { IndirectRoute, Location, RouteResults, RouteStop } from "@/types";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import { Link } from "@inertiajs/react";

export default function SearchResults({
    routes,
    from,
    to,
    indirectRoutes,
    intersectStops,
}: {
    routes: RouteResults[];
    from: Location;
    to: Location;
    indirectRoutes: IndirectRoute[];
    intersectStops: RouteStop[];
}) {
    return (
        <Accordion type="multiple" className="flex flex-col gap-2">
            {routes.map((result, index) => {
                const stopOrder = result.stop_order.toSorted((a, b) => a - b);
                const towardsLast =
                    result.route_stops[stopOrder[0]].location.url_slug ===
                    from.url_slug;
                const stopsBetween = stopOrder[1] - stopOrder[0];
                const routeStops = towardsLast
                    ? result.route_stops
                    : result.route_stops.toReversed();
                const sortedStopOrder = towardsLast
                    ? stopOrder
                    : [
                          routeStops.length - stopOrder[1] - 1,
                          routeStops.length - stopOrder[0] - 1,
                      ];
                return (
                    <AccordionItem
                        value={result.route_name}
                        key={index}
                        className="bg-white rounded-lg shadow-md border-t border-gray-100"
                    >
                        <AccordionTrigger className="p-4 cursor-pointer justify-start hover:no-underline hover:bg-gray-100">
                            <div className="flex justify-between items-center w-1/4">
                                <h2 className="text-xl font-bold flex items-center gap-2 w-full">
                                    <BusFrontIcon /> {result.route_name}
                                </h2>
                                {/* <span className="text-primary font-bold">
                                    {result.fare}
                                </span> */}
                            </div>
                            {result.has_express && (
                                <span className="bg-gray-300 text-base py-1 px-3 rounded-md ml-auto">
                                    Express
                                </span>
                            )}
                            {result.has_govt && (
                                <span className="bg-gray-300 text-base py-1 px-3 rounded-md ml-auto">
                                    KSRTC
                                </span>
                            )}
                            {result.has_local && (
                                <span className="bg-gray-300 text-base py-1 px-3 rounded-md ml-auto">
                                    Local / Private
                                </span>
                            )}
                            <div className="flex md:w-1/6 w-1/4 md:ml-8 ml-3 mr-2">
                                <div className="flex items-center">
                                    <MapPin className="mr-2" size={20} />
                                    <span>{stopsBetween} stops</span>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="border-t border-gray-200 py-4 px-5">
                            <ul className="">
                                {routeStops.map((stop, index) => {
                                    const startIndex =
                                        index === sortedStopOrder[0];
                                    const endIndex =
                                        index === sortedStopOrder[1];
                                    const indexActive =
                                        index >= sortedStopOrder[0] &&
                                        index <= sortedStopOrder[1];
                                    const borderActive =
                                        index > sortedStopOrder[0] &&
                                        index - 1 < sortedStopOrder[1];
                                    return (
                                        <li
                                            key={index}
                                            className="flex relative items-center gap-3 text-lg py-1 max-w-full"
                                        >
                                            <div
                                                className={
                                                    "relative rounded-full p-0.5 size-7 content-center place-items-center flex-shrink-0 " +
                                                    (startIndex
                                                        ? "bg-green-600 text-white"
                                                        : endIndex
                                                        ? "bg-red-600 text-white"
                                                        : indexActive
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-300")
                                                }
                                            >
                                                {index > 0 && (
                                                    <hr
                                                        className={
                                                            "border-0 absolute bottom-full w-1 h-2 left-1/2 -translate-x-1/2" +
                                                            (borderActive
                                                                ? " bg-primary"
                                                                : " bg-gray-300")
                                                        }
                                                    />
                                                )}
                                                <MapPin size={18} />
                                            </div>
                                            <div className="max-w-full overflow-hidden">
                                                <p className="flex place-items-baseline gap-2 text-nowrap">
                                                    {
                                                        stop.location
                                                            .location_name
                                                    }
                                                    {/* <small className="text-sm text-gray-700 overflow-hidden text-ellipsis">
                                                        {stop.location.address}
                                                    </small> */}
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
            {routes.length === 0 && indirectRoutes.length === 0 && (
                <div className="bg-white rounded-lg shadow-md border-t border-gray-100">
                    <div className="p-4 justify-start hover:no-underline">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold flex items-center gap-2 w-full">
                                <BusFrontIcon className="align-top" /> No Routes
                                Found
                            </h2>
                        </div>
                    </div>
                </div>
            )}
            {indirectRoutes.length > 0 && (
                <>
                    <div className="bg-white rounded-lg shadow-md border-t border-gray-100">
                        <div className="p-4 justify-start hover:no-underline">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold w-full">
                                    <BusFrontIcon className="inline-block mr-2 align-top" />
                                    Connecting routes are available, you can
                                    click the icons to switch busses at
                                    locations marked as
                                    <div className="inline-block align-middle ml-2 relative rounded-full p-0.5 size-7 content-center place-items-center bg-purple-600 text-white">
                                        <ExternalLink size={18} />
                                    </div>
                                </h2>
                            </div>
                        </div>
                    </div>
                    {indirectRoutes.map((locationRoute, index) => {
                        const result = locationRoute.route;
                        const towardsLast =
                            result.route_stops[result.boardingPoint].location
                                .url_slug === from.url_slug;
                        const routeStops = towardsLast
                            ? result.route_stops
                            : result.route_stops.toReversed();
                        const sortedBoardingPoint = towardsLast
                            ? result.boardingPoint
                            : routeStops.length - result.boardingPoint - 1;
                        return (
                            <AccordionItem
                                value={result.route_name}
                                key={"C-" + index}
                                className="bg-white rounded-lg shadow-md border-t border-gray-100"
                            >
                                <AccordionTrigger className="p-4 cursor-pointer justify-start hover:no-underline hover:bg-gray-100">
                                    <div className="flex justify-between items-center w-1/4">
                                        <h2 className="text-xl font-bold flex items-center gap-2 w-full">
                                            <BusFrontIcon /> {result.route_name}
                                        </h2>
                                    </div>
                                    <div className="flex-grow text-end mr-2">
                                        {result.has_express && (
                                            <span className="bg-gray-300 text-base py-1 px-3 rounded-md ml-auto">
                                                Express
                                            </span>
                                        )}
                                        {result.has_govt && (
                                            <span className="bg-gray-300 text-base py-1 px-3 rounded-md ml-auto">
                                                KSRTC
                                            </span>
                                        )}
                                        {result.has_local && (
                                            <span className="bg-gray-300 text-base py-1 px-3 rounded-md ml-auto">
                                                Local / Private
                                            </span>
                                        )}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="border-t border-gray-200 py-4 px-5">
                                    <ul className="flex flex-col">
                                        {routeStops.map((stop, index) => {
                                            const startIndex =
                                                index === sortedBoardingPoint;
                                            const deboardIndex =
                                                locationRoute.switchingPoints.find(
                                                    (point) =>
                                                        point.order === index
                                                );
                                            return (
                                                <li
                                                    key={index}
                                                    className="flex relative items-center gap-3 text-lg py-1"
                                                >
                                                    <div
                                                        className={
                                                            "relative rounded-full p-0.5 size-7 content-center place-items-center flex-shrink-0 " +
                                                            (startIndex
                                                                ? "bg-green-600 text-white"
                                                                : deboardIndex
                                                                ? "bg-purple-600 text-white"
                                                                : "bg-gray-300")
                                                        }
                                                    >
                                                        {index > 0 && (
                                                            <hr
                                                                className={
                                                                    "border-0 absolute bottom-full w-1 h-2 left-1/2 -translate-x-1/2 bg-gray-300"
                                                                }
                                                            />
                                                        )}
                                                        {deboardIndex ? (
                                                            <Link
                                                                className="block"
                                                                href={route(
                                                                    "routes",
                                                                    {
                                                                        from: stop
                                                                            .location
                                                                            .url_slug,
                                                                        to: to.url_slug,
                                                                    }
                                                                )}
                                                            >
                                                                <ExternalLink
                                                                    size={18}
                                                                />
                                                            </Link>
                                                        ) : (
                                                            <MapPin size={18} />
                                                        )}
                                                    </div>
                                                    <div className="max-w-full overflow-hidden">
                                                        <p className="flex place-items-baseline gap-2 text-nowrap">
                                                            {
                                                                stop.location
                                                                    .location_name
                                                            }
                                                            <small className="text-sm text-gray-700 overflow-hidden text-ellipsis">
                                                                {
                                                                    stop
                                                                        .location
                                                                        .address
                                                                }
                                                            </small>
                                                        </p>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </>
            )}
            {intersectStops.length > 0 && (
                <>
                    <div className="bg-white rounded-lg shadow-md border-t border-gray-100">
                        <div className="p-4 justify-start hover:no-underline">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold w-full">
                                    <ExternalLink className="inline-block mr-2 align-top" />
                                    Select the connecting location to continue
                                    towards {to.location_name}
                                </h2>
                            </div>
                        </div>
                    </div>
                    {intersectStops.map((stop, index) => {
                        return (
                            <Link
                                href={route("routes", {
                                    from: stop.location.url_slug,
                                    to: to.url_slug,
                                })}
                                key={index}
                                className="bg-white rounded-lg shadow-md border-t border-gray-100"
                            >
                                <div className="p-4 justify-start hover:no-underline">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold w-full">
                                            <MapPin className="inline-block mr-2" />
                                            {stop.location.location_name}
                                        </h2>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </>
            )}
        </Accordion>
    );
}
