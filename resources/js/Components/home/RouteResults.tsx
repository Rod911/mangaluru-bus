import { MapPin, Clock, DollarSign, BusFrontIcon } from "lucide-react";
import { Route } from "@/types";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import LeafletMap from "../LeafletMap";

export default function RouteResults({
    routes,
    activeIndices,
}: {
    routes: Route[];
    activeIndices?: number[];
}) {
    return (
        <Accordion type="multiple" className="grid gap-2">
            {routes.map((result, index) => {
                const activeStop = activeIndices?.[index];
                const mapMarkers = result.route_stops
                    .map((stop) => {
                        const coordinates =
                            stop.bus_stop?.coordinates ||
                            stop.default_bus_stop?.coordinates ||
                            null;
                        if (!coordinates) return null;
                        const pos = {
                            coordinates,
                            label: stop.location.location_name,
                        };
                        return pos.coordinates ? pos : null;
                    })
                    .filter((coord) => !!coord);
                const mapIsComplete =
                    mapMarkers.length === result.route_stops.length;
                const positions = mapIsComplete
                    ? mapMarkers.map((pos, posIndex) => {
                          return {
                              pos: {
                                  lat: pos.coordinates.latitude,
                                  lng: pos.coordinates.longitude,
                              },
                              highlight: posIndex === activeStop,
                              label: pos.label,
                          };
                      })
                    : [];
                const paths = positions
                    .map((pos, index, arr) => {
                        if (index === arr.length - 1) return null;
                        return {
                            from: pos.pos,
                            to: arr[index + 1].pos,
                        };
                    })
                    .filter((path) => !!path);
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
                            <div className="ml-auto mr-2">
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
                        <AccordionContent className="border-t border-gray-200 py-4 px-8 grid gap-2 grid-cols-2 max-md:grid-cols-1">
                            <ul className="flex flex-col">
                                {result.route_stops.map((stop, index) => {
                                    const indexActive = index === activeStop;
                                    return (
                                        <li
                                            key={index}
                                            className="flex relative items-center gap-3 text-lg py-1"
                                        >
                                            <div
                                                className={
                                                    "relative rounded-full p-0.5 size-7 content-center place-items-center " +
                                                    (indexActive
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-300")
                                                }
                                            >
                                                {index > 0 && (
                                                    <hr className="border-0 absolute bottom-full w-1 h-2 left-1/2 -translate-x-1/2 bg-gray-300" />
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
                            {mapIsComplete && (
                                <div
                                    className="w-full rounded-lg overflow-hidden"
                                    style={{ height: "30rem" }}
                                >
                                    <LeafletMap
                                        positions={positions}
                                        paths={paths}
                                        zoom={13}
                                        mapKey={result.uuid}
                                    />
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
}
