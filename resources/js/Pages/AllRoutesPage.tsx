import { Head } from "@inertiajs/react";
import Layout from "@/Components/Layout";
import { Route } from "@/types";
import RouteResults from "@/Components/home/RouteResults";
import TextInput from "@/Components/TextInput";
import { useState } from "react";

import fuzzy from "fuzzy";

export default function SearchResultsPage({
    app_name,
    title,
    routes,
}: {
    app_name: string;
    title: string;
    routes: Route[];
}) {
    const [search, setSearch] = useState("");
    const filteredRoutes = fuzzy.filter(search, routes, {
        extract(input) {
            return input.route_name;
        },
    });
    return (
        <Layout app_name={app_name}>
            <Head title={title} />
            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-2 max-md:flex-col justify-between mb-6">
                    <h1 className="text-3xl font-bold mb-6">{title}</h1>
                    <TextInput
                        type="search"
                        name="search"
                        placeholder="Search"
                        className="h-12 w-80 max-md:w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <RouteResults routes={filteredRoutes.map((r) => r.original)} />
            </div>
        </Layout>
    );
}
