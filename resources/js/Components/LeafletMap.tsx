import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { LatLngExpression, Map } from "leaflet";

export default function LeafletMap({
    position,
    zoom = 13,
}: {
    position: LatLngExpression;
    zoom?: number;
}) {
    const [map, setMap] = useState<Map | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && !map) {
            const initMap = async () => {
                const L = await import("leaflet");
                const mapInstance = L.map("map", {
                    zoomControl: false,
                }).setView(position, zoom);

                L.tileLayer(
                    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                ).addTo(mapInstance);

                L.marker(position).addTo(mapInstance);
                // .bindPopup("A CSS3+HTML5 <br> pop-up.")
                // .openPopup();

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
    }, [position]);

    return <div id="map" style={{ height: "100%", width: "100%" }}></div>;
}
