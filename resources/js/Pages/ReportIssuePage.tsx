import { Head, useForm } from "@inertiajs/react";
import Layout from "../Components/Layout";
import PrimaryButton from "@/Components/PrimaryButton";
import { FormEventHandler, useState } from "react";
import { Camera, X } from "lucide-react";
import { Select, Textarea } from "@headlessui/react";

export default function ReportIssuePage({
    app_name,
    response,
}: {
    app_name: string;
    response?: { success: boolean; message: string };
}) {
    const { data, setData, post, processing, progress, errors, reset } =
        useForm<{
            issueType: string;
            description: string;
            photo: File | null;
            contactInfo: string;
        }>({
            issueType: "",
            description: "",
            photo: null,
            contactInfo: "",
        });
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        response = undefined;
        post(route("report-issue.store"), {
            onSuccess: () => {
                reset("issueType", "description", "photo", "contactInfo");
            },
        });
    };
    return (
        <Layout app_name={app_name}>
            <Head title="Report Issue" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Report an Issue</h1>
                <form
                    onSubmit={submit}
                    className="bg-white p-6 rounded-lg shadow-md"
                >
                    <div className="mb-4">
                        <label
                            htmlFor="issueType"
                            className="block mb-1 font-bold"
                        >
                            Issue Type
                        </label>
                        <Select
                            id="issueType"
                            value={data.issueType}
                            onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>
                            ) => setData("issueType", e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="" hidden>
                                Select an issue type
                            </option>
                            <option value="incorrect_route">
                                Incorrect / Missing route information
                            </option>
                            <option value="site_issue">
                                Broken UI / Bugs in application
                            </option>
                            <option value="other">Other</option>
                        </Select>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="description"
                            className="block mb-1 font-bold"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="w-full p-2 border rounded"
                            rows={4}
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="photo" className="block mb-1 font-bold">
                            Photo (optional)
                        </label>
                        {data.photo && (
                            <div className="mb-2 flex gap-2 items-start">
                                <img
                                    src={URL.createObjectURL(data.photo)}
                                    alt="Photo"
                                    className="border p-1"
                                    width={200}
                                />
                                <button type="button" onClick={() => setData("photo", null)}><X /></button>
                            </div>
                        )}
                        <div className="flex items-center">
                            <input
                                type="file"
                                id="photo"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                    e.target.files
                                        ? setData("photo", e.target.files[0])
                                        : null
                                }
                            />
                            <label
                                htmlFor="photo"
                                className="cursor-pointer bg-secondary text-primary px-4 py-2 rounded flex items-center"
                            >
                                <Camera className="mr-2" size={20} />
                                Upload Photo
                            </label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="contactInfo"
                            className="block mb-1 font-bold"
                        >
                            Contact Information (optional)
                        </label>
                        <Textarea
                            id="contactInfo"
                            value={data.contactInfo}
                            onChange={(e) =>
                                setData("contactInfo", e.target.value)
                            }
                            className="w-full p-2 border rounded"
                            placeholder="Email, phone number, etc. Updates will be sent to this contact."
                            rows={2}
                        />
                    </div>
                    {progress && (
                        <div className="mb-4">
                            <div className="w-1/6 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div
                                    className="bg-primary h-2.5 rounded-full"
                                    style={{ width: progress.percentage + "%" }}
                                ></div>
                            </div>
                        </div>
                    )}
                    {response && (
                        <div className="mb-4">
                            <p
                                className={
                                    response.success
                                        ? "text-green-600"
                                        : "text-red-600"
                                }
                            >
                                {response.message}
                            </p>
                        </div>
                    )}
                    <PrimaryButton
                        type="submit"
                        disabled={processing}
                        className="bg-primary text-white px-6 py-2 rounded"
                    >
                        Submit Report
                    </PrimaryButton>
                </form>
            </div>
        </Layout>
    );
}
