import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";

export default function AdminView({
    children,
    title,
    addRoute,
    viewRoute,
}: PropsWithChildren & {
    title?: string;
    addRoute?: string;
    viewRoute?: string;
}) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-start justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {title}
                    </h2>
                    <div className="flex items-center">
                        {addRoute && (
                            <Link
                                href={route(addRoute)}
                                className="inline-flex items-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Add
                            </Link>
                        )}
                        {viewRoute && (
                            <Link
                                href={route(viewRoute)}
                                className="inline-flex items-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                View
                            </Link>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={title} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
