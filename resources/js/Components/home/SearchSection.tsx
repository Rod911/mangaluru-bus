import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Search } from "lucide-react";
import Select from "react-select";
import { Location } from "@/types";

export default function SearchSection({
    locations,
}: {
    locations: Location[];
}) {
    const [searchType, setSearchType] = useState("location");

    const [values, setValues] = useState({
        from: "",
        towards: "",
        route: "",
    });

    function handleChange(key: string | null = "", value: string = "") {
        key
            ? setValues((values) => ({
                  ...values,
                  [key]: value,
              }))
            : null;
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        router.get("/search", { ...values, type: searchType });
    }

    const locationOptions = locations.map((loc) => ({
        value: loc.uuid,
        label: loc.location_name,
    }));

    return (
        <section className="">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex mb-4">
                    <button
                        className={`flex-1 py-2 px-4 text-center ${
                            searchType === "location"
                                ? "bg-primary text-white"
                                : "bg-gray-50"
                        }`}
                        onClick={() => setSearchType("location")}
                    >
                        Location Search
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 text-center ${
                            searchType === "route"
                                ? "bg-primary text-white"
                                : "bg-gray-50"
                        }`}
                        onClick={() => setSearchType("route")}
                    >
                        Route Search
                    </button>
                </div>
                {searchType === "location" ? (
                    <form
                        className="flex flex-col md:flex-row gap-4"
                        method="GET"
                        onSubmit={handleSubmit}
                    >
                        <Select
                            options={locationOptions}
                            placeholder="From"
                            className="w-full"
                            required
                            name="from"
                            defaultValue={values.from}
                            onChange={(option) =>
                                handleChange("from", option?.value)
                            }
                        />
                        <Select
                            options={locationOptions}
                            placeholder="To"
                            className="w-full"
                            required
                            name="to"
                            defaultValue={values.towards}
                            onChange={(option) =>
                                handleChange("towards", option?.value)
                            }
                        />
                        <button
                            type="submit"
                            className="bg-primary text-white p-2 rounded flex items-center justify-center"
                        >
                            <Search size={20} className="mr-2" />
                            Search
                        </button>
                    </form>
                ) : (
                    <form
                        className="flex gap-4"
                        method="GET"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="text"
                            placeholder="Enter route number"
                            className="flex-1 p-2 border rounded"
                            required
                            name="route"
                            value={values.route}
                            onChange={(e) =>
                                handleChange("route", e.target.value)
                            }
                        />
                        <button
                            type="submit"
                            className="bg-primary text-white p-2 rounded flex items-center justify-center"
                        >
                            <Search size={20} className="mr-2" />
                            Search
                        </button>
                    </form>
                )}
            </div>
            <div className="mt-4 text-right">
                <Link href="/report-issue" className="bg-gray-50 text-primary py-2 px-4 rounded inline-block">
                    Report Issue
                </Link>
            </div>
        </section>
    );
}
