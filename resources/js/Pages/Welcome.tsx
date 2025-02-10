import { Location, PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";

import Layout from "../Components/Layout";
import SearchSection from "../Components/home/SearchSection";
import QuickAccessSection from "../Components/home/QuickAccessSection";
import NewsUpdatesSection from "../Components/home/NewsUpdatesSection";
import DownloadAppSection from "../Components/home/DownloadAppSection";

export default function HomePage({
    auth,
    app_name,
    locations,
}: PageProps<{
    app_name: string;
    locations: Location[];
}>) {
    return (
        <>
            <Head title="Welcome" />
            <Layout app_name={app_name}>
                <div className="container mx-auto px-4 py-8 gap-y-8 grid">
                    <SearchSection locations={locations} />
                    {/* <QuickAccessSection /> */}
                    {/* <NewsUpdatesSection /> */}
                    {/* <DownloadAppSection /> */}
                </div>
            </Layout>
        </>
    );
}
