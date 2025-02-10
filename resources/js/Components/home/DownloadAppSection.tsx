import { Smartphone } from "lucide-react";

export default function DownloadAppSection() {
    return (
        <section className="">
            <div className="bg-primary text-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0 md:mr-4">
                    <h2 className="text-2xl font-bold mb-2">
                        Download Our Mobile App
                    </h2>
                    <p>
                        Get real-time updates, plan your trips, and buy tickets
                        on the go!
                    </p>
                </div>
                <div className="flex space-x-4">
                    <button className="bg-white text-primary py-2 px-4 rounded flex items-center">
                        <Smartphone className="mr-2" size={20} />
                        App Store
                    </button>
                    <button className="bg-white text-primary py-2 px-4 rounded flex items-center">
                        <Smartphone className="mr-2" size={20} />
                        Google Play
                    </button>
                </div>
            </div>
        </section>
    );
}
