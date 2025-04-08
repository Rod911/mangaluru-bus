import { Location, PageProps, PopularLocation } from "@/types";
import { Head } from "@inertiajs/react";

import Layout from "@/Components/Layout";
import SearchSection from "@/Components/home/SearchSection";
import QuickAccessSection from "@/Components/home/QuickAccessSection";
import FaqSection from "@/Components/home/FaqSection";
import HomeBodySection from "@/Components/home/HomeBodySection";

export default function HomePage({
    auth,
    app_name,
    locations,
    popularLocations,
    popularRoutes,
}: PageProps<{
    app_name: string;
    locations: Location[];
    popularLocations: PopularLocation[];
    popularRoutes: PopularLocation[];
}>) {
    return (
        <>
            <Head title="City Bus Route Information for Mangalore City">
                <link
                    rel="canonical"
                    href="https://mangaluru-bus.rmalc911.in/"
                />
            </Head>
            <Layout app_name={app_name}>
                <div className="container mx-auto px-4 py-8 gap-y-8 grid">
                    <SearchSection locations={locations} />
                    <HomeBodySection />
                    <QuickAccessSection
                        popularLocations={popularLocations}
                        popularRoutes={popularRoutes}
                    />
                    <FaqSection />
                </div>
            </Layout>
        </>
    );
}
