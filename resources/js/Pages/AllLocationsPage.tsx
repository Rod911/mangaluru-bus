import { Head, Link } from "@inertiajs/react";
import Layout from "@/Components/Layout";
import { Location } from "@/types";
import TextInput from "@/Components/TextInput";
import { useState } from "react";

import fuzzy from "fuzzy";

export default function AllLocationsPage({
    app_name,
    locations,
}: {
    app_name: string;
    locations: Location[];
}) {
    const [search, setSearch] = useState("");
    const filteredLocations = fuzzy.filter(search, locations, {
        extract(input) {
            return input.location_name;
        },
        pre: "<b class='text-primary'>",
        post: "</b>",
    });
    return (
        <Layout app_name={app_name}>
            <Head title="All Routes" />
            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-2 max-md:flex-col justify-between mb-6">
                    <h1 className="text-3xl font-bold">All Locations</h1>
                    <TextInput
                        type="search"
                        name="search"
                        placeholder="Search"
                        className="h-12 w-80 max-md:w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredLocations.map((result) => {
                        const location = result.original;
                        return (
                            <Link
                                key={location.url_slug}
                                href={route("location", {
                                    location: location.url_slug,
                                })}
                                className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow duration-200"
                            >
                                <p
                                    className="text-gray-800 font-medium"
                                    dangerouslySetInnerHTML={{
                                        __html: result.string,
                                    }}
                                ></p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
}
