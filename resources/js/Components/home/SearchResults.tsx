import { MapPin, Clock, DollarSign, BusFrontIcon } from "lucide-react";
import { Location, RouteResults } from "@/types";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";

export default function SearchResults({
    routes,
    from,
    to,
}: {
    routes: RouteResults[];
    from: Location;
    to: Location;
}) {
    return (
        <Accordion type="multiple" className="grid gap-2">
            {routes.map((result, index) => {
                const stopOrder = result.stop_order.toSorted((a, b) => a - b);
                const towardsLast =
                    result.route_stops[stopOrder[0]].location.uuid ===
                    from.uuid;
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
                            {result.has_express == 1 && (
                                <span className="bg-gray-300 text-base py-1 px-3 rounded-md ml-auto">
                                    Express
                                </span>
                            )}
                            {result.has_govt == 1 && (
                                <span className="bg-gray-300 text-base py-1 px-3 rounded-md ml-auto">
                                    KSRTC
                                </span>
                            )}
                            {result.has_local == 1 && (
                                <span className="bg-gray-300 text-base py-1 px-3 rounded-md ml-auto">
                                    Local / Private
                                </span>
                            )}
                            <div className="flex w-1/6 ml-8">
                                {/* <div className="flex items-center">
                                    <Clock className="mr-2" size={20} />
                                    <span>
                                        {result.departure} - {result.arrival}
                                    </span>
                                </div> */}
                                <div className="flex items-center">
                                    <MapPin className="mr-2" size={20} />
                                    <span>{stopsBetween} stops</span>
                                </div>
                                {/* <div className="flex items-center">
                                    <DollarSign className="mr-2" size={20} />
                                    <span>{result.fare}</span>
                                </div> */}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="border-t border-gray-200 py-4 px-8">
                            <ul className="flex flex-col">
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
                                            className="flex relative items-center gap-3 text-lg py-1"
                                        >
                                            <div
                                                className={
                                                    "relative rounded-full p-0.5 size-7 content-center place-items-center " +
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
                                            <div className="">
                                                <p className="flex place-items-baseline gap-2">
                                                    {
                                                        stop.location
                                                            .location_name
                                                    }
                                                    <small className="text-sm text-gray-700">
                                                        {stop.location.address}
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
            {routes.length === 0 && (
                <div className="bg-white rounded-lg shadow-md border-t border-gray-100">
                    <div className="p-4 justify-start hover:no-underline">
                        <div className="flex justify-between items-center w-1/4">
                            <h2 className="text-xl font-bold flex items-center gap-2 w-full">
                                <BusFrontIcon /> No Routes Found
                            </h2>
                        </div>
                    </div>
                </div>
            )}
        </Accordion>
    );
}
