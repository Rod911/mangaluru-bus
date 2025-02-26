export default function HomeBodySection() {
    return (
        <div className="text-gray-700">
            <h1 className="text-3xl font-bold mb-6">
                Mangaluru Bus Route Finder
            </h1>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">
                    Welcome to MangaluruBus
                </h2>
                <p className=" mb-4">
                    MangaluruBus provides comprehensive route information for
                    all public transportation in Mangaluru city. Our service
                    helps you find the most convenient bus routes across local,
                    express, and KSRTC services. Whether you're a resident,
                    student, or tourist, we make navigating Mangaluru's public
                    transport network simple.
                </p>
                <p className="">
                    We specialize in providing accurate route information,
                    including connecting bus options when direct routes aren't
                    available between your desired locations.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">
                    How to Use MangaluruBus
                </h2>
                <p className=" mb-4">
                    Simply enter your starting point and destination in the
                    search boxes above. Click search, and we'll show you all
                    available routes, including direct options and connecting
                    services where needed. Our database covers all bus types
                    operating within and around Mangaluru, providing the most
                    complete route information available.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Our Services</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-primary-light p-6 rounded-lg shadow">
                        <h3 className="text-xl font-medium mb-3">
                            Local Bus Routes
                        </h3>
                        <p className="">
                            Complete information on city bus routes covering all
                            areas within Mangaluru city limits.
                        </p>
                    </div>
                    <div className="bg-primary-light p-6 rounded-lg shadow">
                        <h3 className="text-xl font-medium mb-3">
                            Express Services
                        </h3>
                        <p className="">
                            Fast routes with limited stops between major
                            destinations in and around Mangaluru.
                        </p>
                    </div>
                    <div className="bg-primary-light p-6 rounded-lg shadow">
                        <h3 className="text-xl font-medium mb-3">
                            KSRTC Routes
                        </h3>
                        <p className="">
                            Karnataka State Road Transport Corporation services
                            connecting Mangaluru to nearby towns and villages.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
