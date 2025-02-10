import { AlertTriangle, MapPin, Bus } from "lucide-react";

export default function QuickAccessSection() {
    return (
        <section className="">
            <h2 className="text-2xl font-bold mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-bold mb-2 flex items-center">
                        <Bus className="mr-2" size={20} />
                        Popular Routes
                    </h3>
                    <ul className="list-disc list-inside">
                        <li>Route 1: Downtown - Airport</li>
                        <li>Route 5: University - Shopping Center</li>
                        <li>Route 10: Suburbs - City Center</li>
                    </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-bold mb-2 flex items-center">
                        <AlertTriangle className="mr-2" size={20} />
                        Service Updates
                    </h3>
                    <ul className="list-disc list-inside">
                        <li>Route 3: Delays due to construction</li>
                        <li>Route 7: Temporary detour in effect</li>
                    </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-bold mb-2 flex items-center">
                        <MapPin className="mr-2" size={20} />
                        Real-time Bus Locations
                    </h3>
                    <p>View the current locations of buses on the map.</p>
                    <button className="mt-2 bg-primary text-white py-2 px-4 rounded">
                        Open Map
                    </button>
                </div>
            </div>
        </section>
    );
}
