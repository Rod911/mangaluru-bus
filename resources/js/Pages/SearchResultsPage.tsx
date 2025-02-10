import { Head } from "@inertiajs/react";
import Layout from "../Components/Layout";
import { Filter } from "lucide-react";
import { useState } from "react";
import { Location, RouteResults } from "@/types";
import PrimaryButton from "@/Components/PrimaryButton";
import SearchResults from "@/Components/home/SearchResults";

export default function SearchResultsPage({
    app_name,
    from,
    to,
    routes,
}: {
    app_name: string;
    from: Location;
    to: Location;
    routes: RouteResults[];
}) {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <Layout app_name={app_name}>
            <Head title="Search Results" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Search Results</h1>
                <div className="mb-4 flex justify-between items-center">
                    <p className="text-lg">
                        From: {from.location_name} | To: {to.location_name}
                    </p>
                    {/* <PrimaryButton
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center"
                    >
                        <Filter className="mr-2" size={20} />
                        Filters
                    </PrimaryButton> */}
                </div>
                {/* {showFilters && (
                    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                        <h2 className="font-bold mb-2">Filter Options</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block mb-1">
                                    Max Transfers
                                </label>
                                <select className="w-full p-2 border rounded">
                                    <option>Any</option>
                                    <option>0</option>
                                    <option>1</option>
                                    <option>2</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1">Bus Type</label>
                                <select className="w-full p-2 border rounded">
                                    <option>Any</option>
                                    <option>Regular</option>
                                    <option>Express</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )} */}
                <SearchResults routes={routes} from={from} to={to} />
            </div>
        </Layout>
    );
}
