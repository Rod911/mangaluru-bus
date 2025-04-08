import Layout from "@/Components/Layout";
import { Head } from "@inertiajs/react";

export default function AboutPage({ app_name }: { app_name: string }) {
    return (
        <>
            <Head title="About" />
            <Layout app_name={app_name}>
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">
                        About MangaluruBus
                    </h1>

                    <section className="mb-10">
                        <p className=" mb-4">
                            MangaluruBus provides comprehensive route
                            information for all public transportation in
                            Mangalore city. Our service helps you find the most
                            convenient bus routes across local, express, and
                            KSRTC services. Whether you're a resident, student,
                            or tourist, we make navigating Mangalore's public
                            transport network simple.
                        </p>
                        <p className="">
                            We specialize in providing accurate route
                            information, including connecting bus options when
                            direct routes aren't available between your desired
                            locations.
                        </p>
                    </section>
                </div>
            </Layout>
        </>
    );
}
