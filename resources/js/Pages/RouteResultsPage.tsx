import { Head } from "@inertiajs/react";
import Layout from "@/Components/Layout";
import { Route } from "@/types";
import RouteResults from "@/Components/home/RouteResults";

export default function SearchResultsPage({
    app_name,
    routes,
    query,
}: {
    app_name: string;
    routes: Route[];
    query: string;
}) {

    return (
        <Layout app_name={app_name}>
            <Head title={"Search Results for '" + query + "'"} />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Search Results</h1>
                <RouteResults routes={routes} />
            </div>
        </Layout>
    );
}
