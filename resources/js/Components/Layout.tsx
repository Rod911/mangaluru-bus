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
                <meta name="description" content="Search for your bus in Mangalore City" />
                <link rel="shortcut icon" href="/images/mangaluru-bus-i.png" />
                <link
                    rel="icon"
                    type="image/png"
                    href="/images/mangaluru-bus-i.png"
                />
            </Head>
            <div className="min-h-screen flex flex-col">
                <header className="bg-primary text-white p-4">
                    <div className="container mx-auto flex justify-between items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <img src="/images/mangaluru-bus-hw.png" alt={app_name} className="h-16" />
                        </Link>
                        <nav className="hidden md:block">
                            <ul className="flex space-x-4">
                                <li>
                                    <Link href="/">Home</Link>
                                </li>
                                <li>
                                    <Link href="/report-issue">
                                        Report Issue
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                        <button
                            className="md:hidden"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </header>
                {isMenuOpen && (
                    <nav className="bg-primary text-white p-4 md:hidden">
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="block">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/report-issue" className="block">
                                    Report Issue
                                </Link>
                            </li>
                        </ul>
                    </nav>
                )}
                <main className="flex-grow">{children}</main>
                <footer className="bg-gray-50 text-blue-950 p-4">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-4 md:mb-0">
                                <p>&copy; 2025 {app_name}</p>
                            </div>
                            {/* <nav>
                            <ul className="flex space-x-4">
                                <li>
                                    <Link href="/contact">Contact</Link>
                                </li>
                                <li>
                                    <Link href="/terms">Terms of Service</Link>
                                </li>
                            </ul>
                        </nav> */}
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
