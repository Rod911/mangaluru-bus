import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Search } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Location } from "@/types";
import { Combobox } from "../custom-ui/combobox";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";

const FormSchema = z.object({
    from: z.string({ required_error: "Please select from location" }),
    towards: z.string({ required_error: "Please select to location" }),
});
export default function SearchSection({
    locations,
}: {
    locations: Location[];
}) {
    const [searchType, setSearchType] = useState("location");

    const [values, setValues] = useState({
        route: "",
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    function handleChange(key: string | null = "", value: string = "") {
        key
            ? setValues((values) => ({
                  ...values,
                  [key]: value,
              }))
            : null;
    }

    function handleSubmit(data: z.infer<typeof FormSchema>) {
        router.get(route("routes", { from: data.from, to: data.towards }));
    }

    function handleRouteSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        router.get(route("routes-search", { route: values.route }));
    }

    const locationOptions = locations.map((loc) => ({
        value: loc.url_slug,
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
                    <Form {...form}>
                        <form
                            className="flex flex-col md:flex-row gap-4"
                            method="GET"
                            onSubmit={form.handleSubmit(handleSubmit)}
                        >
                            <FormField
                                control={form.control}
                                name="from"
                                render={({ field }) => (
                                    <FormItem className="w-full h-10">
                                        <Combobox
                                            options={locationOptions}
                                            triggerClassName="h-full"
                                            placeholder="From"
                                            noResults="No locations found."
                                            onChange={(option) =>
                                                form.setValue(
                                                    field.name,
                                                    option
                                                )
                                            }
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="towards"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="w-full h-10">
                                        <Combobox
                                            options={locationOptions}
                                            triggerClassName="h-full"
                                            placeholder="To"
                                            noResults="No locations found."
                                            onChange={(option) =>
                                                form.setValue(
                                                    field.name,
                                                    option
                                                )
                                            }
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <button
                                type="submit"
                                className="bg-primary text-white p-2 rounded flex items-center justify-center"
                            >
                                <Search size={20} className="mr-2" />
                                Search
                            </button>
                        </form>
                    </Form>
                ) : (
                    <form
                        className="flex gap-4"
                        method="GET"
                        onSubmit={handleRouteSubmit}
                    >
                        <input
                            type="text"
                            placeholder="Enter route number"
                            className="flex-1 p-2 border border-inherit rounded h-10"
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
                <Link
                    href="/report-issue"
                    className="bg-gray-50 text-primary py-2 px-4 rounded inline-block"
                >
                    Report Issue
                </Link>
            </div>
        </section>
    );
}
