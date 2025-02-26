import { Head } from "@inertiajs/react";
import Layout from "@/Components/Layout";

export default function SearchResultsPage({
    app_name,
    error,
}: {
    app_name: string;
    error: string;
}) {
    return (
        <Layout app_name={app_name}>
            <Head title="Error" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">{error}</h1>
            </div>
        </Layout>
    );
}
