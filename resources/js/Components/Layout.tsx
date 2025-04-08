import { Head, Link } from "@inertiajs/react";
import { Bus, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Layout({
    app_name,
    children,
}: {
    app_name: string;
    children: React.ReactNode;
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <Head>
                <meta
                    name="description"
                    content="Find comprehensive bus route information for Mangalore city. Discover direct routes and connecting buses for all destinations."
                />
                <link rel="shortcut icon" href="/images/mangaluru-bus-i.png" />
                <link
                    rel="icon"
                    type="image/png"
                    href="/images/mangaluru-bus-i.png"
                />
            </Head>
            <div className="min-h-screen flex flex-col">
                <header className="bg-primary text-white p-4 sticky top-0 z-10">
                    <div className="container mx-auto flex justify-between items-center">
                        <Link
                            href={route("home")}
                            className="flex items-center space-x-2"
                        >
                            <img
                                src="/images/mangaluru-bus-hw.png"
                                alt={app_name}
                                className="h-16"
                                width={242}
                                height={64}
                            />
                        </Link>
                        <nav className="hidden md:block">
                            <ul className="flex space-x-4">
                                <li>
                                    <Link href={route("home")}>Home</Link>
                                </li>
                                <li>
                                    <Link href={route("report-issue")}>
                                        Report Issue
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                        <button
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                    {isMenuOpen && (
                        <nav className="bg-primary text-white mt-4 md:hidden">
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href={route("home")}
                                        className="block"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route("report-issue")}
                                        className="block"
                                    >
                                        Report Issue
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    )}
                </header>
                <main className="flex-grow">{children}</main>
                <footer className="bg-gray-50 text-blue-950 p-4">
                    <div className="container mx-auto">
                        <div className="flex gap-x-10 gap-y-2 flex-col lg:flex-row justify-between items-center text-center md:text-left">
                            <div className="mb-4 md:mb-0">
                                <p className="">
                                    &copy; 2025 {app_name} - The comprehensive
                                    bus route finder for Mangalore city
                                </p>
                            </div>
                            <nav>
                                <ul className="flex gap-4">
                                    <li>
                                        <Link href={route("about")}>About</Link>
                                    </li>
                                    <li>
                                        <Link href={route("terms")}>
                                            Terms & Conditions
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={route("privacy")}>
                                            Privacy Policy
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
