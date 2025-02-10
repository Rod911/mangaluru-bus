export default function NewsUpdatesSection() {
    return (
        <section className="">
            <h2 className="text-2xl font-bold mb-2">News and Updates</h2>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <ul className="space-y-4">
                    <li>
                        <h3 className="font-bold">New Bus Route Added</h3>
                        <p className="text-sm text-gray-600">May 15, 2025</p>
                        <p>
                            A new express route connecting the suburbs to
                            downtown has been added to our service.
                        </p>
                    </li>
                    <li>
                        <h3 className="font-bold">Summer Schedule in Effect</h3>
                        <p className="text-sm text-gray-600">June 1, 2025</p>
                        <p>
                            Our summer schedule is now in effect. Please check
                            for updated times on your regular routes.
                        </p>
                    </li>
                    <li>
                        <h3 className="font-bold">Fare Changes Coming Soon</h3>
                        <p className="text-sm text-gray-600">July 1, 2025</p>
                        <p>
                            New fare structures will be implemented starting
                            next month. Stay tuned for more information.
                        </p>
                    </li>
                </ul>
            </div>
        </section>
    );
}
