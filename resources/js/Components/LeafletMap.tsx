import ReactDOMServer from "react-dom/server";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { LatLngLiteral, Map } from "leaflet";

type position = {
    pos: LatLngLiteral;
    label?: string;
    highlight?: boolean;
};

type path = {
    from: LatLngLiteral;
    to: LatLngLiteral;
};

export default function LeafletMap({
    mapKey = "map",
    positions,
    paths = [],
    zoom = 13,
}: {
    mapKey?: string;
    positions: position[];
    paths?: path[];
    zoom?: number;
}) {
    if (!positions[0].pos.lat || !positions[0].pos.lng) {
        return "Invalid coordinates";
    }
    const [map, setMap] = useState<Map | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && !map) {
            const initMap = async () => {
                const L = await import("leaflet");
                const center = positions.reduce(
                    (acc, curr, index) => {
                        return {
                            lat: acc.lat + curr.pos.lat,
                            lng: acc.lng + curr.pos.lng,
                        };
                    },
                    { lat: 0, lng: 0 }
                );
                center.lat /= positions.length;
                center.lng /= positions.length;
                const mapInstance = L.map(mapKey, {
                    zoomControl: false,
                }).setView(center, zoom);

                L.tileLayer(
                    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                ).addTo(mapInstance);

                positions.forEach((pos) => {
                    const label = (
                        <a
                            href={
                                "https://www.google.com/maps/place/" +
                                pos.pos.lat +
                                "," +
                                pos.pos.lng
                            }
                            target="_blank"
                        >
                            <b>{pos.label}</b> <br />
                            Click to view on Google Maps
                        </a>
                    );
                    L.marker(pos.pos, {
                        icon: L.icon({
                            iconUrl: pos.highlight
                                ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png"
                                : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
                            shadowUrl:
                                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41],
                        }),
                    })
                        .addTo(mapInstance)
                        .bindPopup(ReactDOMServer.renderToStaticMarkup(label));
                });

                paths.forEach((path) => {
                    L.polyline([path.from, path.to], {
                        color: "	#CB8427",
                    }).addTo(mapInstance);
                });

                setMap(mapInstance);
            };

            initMap();
        }

        // Cleanup function
        return () => {
            if (map) {
                map.remove();
            }
        };
    }, [positions]);

    return (
        <div
            id={mapKey}
            className="z-0"
            style={{ height: "100%", width: "100%" }}
        ></div>
    );
}
