import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import AdminView from "@/Layouts/admin/View";
import { Location, LocationStop } from "@/types";
import { useForm } from "@inertiajs/react";
import { Trash } from "lucide-react";
import { FormEventHandler } from "react";

export default function Locations({ location }: { location?: Location }) {
    const newStop = {
        uuid: "",
        stop_description: "",
        is_two_way: 0,
    } as LocationStop;

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        uuid: location?.uuid ?? "",
        locationName: location?.location_name ?? "",
        locationAddress: location?.address ?? "",
        busStops: location?.bus_stops ?? ([] as LocationStop[]),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        location
            ? patch(route("locations.update", { uuid: location.uuid }))
            : post(route("locations.store"));
    };
    return (
        <AdminView title="Locations" viewRoute="locations.view">
            <form onSubmit={submit}>
                <div className="mb-3 flex gap-4 flex-wrap">
                    <InputLabel
                        htmlFor="location-name"
                        value="Name"
                        className="w-52"
                    />
                    <TextInput
                        type="text"
                        name="location-name"
                        id="location-name"
                        value={data.locationName}
                        className="w-96"
                        autoComplete="off"
                        isFocused={true}
                        onChange={(e) =>
                            setData("locationName", e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.locationName}
                        className="mt-2"
                    />
                </div>
                <div className="mb-3 flex gap-4 flex-wrap">
                    <InputLabel
                        htmlFor="location-address"
                        value="Address"
                        className="w-52"
                    />
                    <textarea
                        name="location-address"
                        id="location-address"
                        value={data.locationAddress}
                        className="w-96 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        autoComplete="off"
                        onChange={(e) =>
                            setData("locationAddress", e.target.value)
                        }
                        rows={3}
                    />
                    <InputError
                        message={errors.locationAddress}
                        className="mt-2"
                    />
                </div>
                <div className="mb-3 flex gap-4 flex-wrap">
                    <InputLabel value="Bus Stops" className="w-52" />
                    <table className="w-1/3 flex-1">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>2 Way?</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.busStops.map((stop, index) => (
                                <LocationStopRow
                                    index={index}
                                    stop={stop}
                                    key={index}
                                    set={(value: LocationStop) =>
                                        setData(
                                            "busStops",
                                            data.busStops.map((s, i) =>
                                                i === index ? value : s
                                            )
                                        )
                                    }
                                    remove={() => {
                                        const filtered = data.busStops.filter(
                                            (s, i) => i !== index
                                        );
                                        setData("busStops", filtered);
                                        console.log(filtered);
                                    }}
                                />
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={3}>
                                    <SecondaryButton
                                        type="button"
                                        onClick={() =>
                                            setData(
                                                "busStops",
                                                data.busStops.concat([
                                                    {
                                                        ...newStop,
                                                        uuid: Math.random().toString(),
                                                    },
                                                ])
                                            )
                                        }
                                    >
                                        Add Bus Stop
                                    </SecondaryButton>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="mb-3 flex gap-2">
                    <TextInput type="hidden" name="id" value={location?.uuid} />
                    <PrimaryButton type="submit" disabled={processing}>
                        Submit
                    </PrimaryButton>
                    <SecondaryButton
                        type="reset"
                        disabled={processing}
                        onClick={() => reset()}
                    >
                        Reset
                    </SecondaryButton>
                </div>
            </form>
        </AdminView>
    );
}

function LocationStopRow({
    index,
    stop,
    set,
    remove,
}: {
    index: number;
    stop: LocationStop;
    set: (value: LocationStop) => void;
    remove: () => void;
}) {
    return (
        <tr key={index}>
            <td>
                <TextInput
                    type="text"
                    name={`stop-description[${index}]`}
                    value={stop.stop_description}
                    className="w-full"
                    autoComplete="off"
                    onChange={(e) => {
                        set({ ...stop, stop_description: e.target.value });
                    }}
                    required
                />
            </td>
            <td className="text-center">
                <input
                    type="checkbox"
                    name={`is_two_way[${index}]`}
                    value="1"
                    defaultChecked={stop.is_two_way === 1}
                    className="w-6 h-6 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    autoComplete="off"
                    onChange={(e) => {
                        set({ ...stop, is_two_way: e.target.checked ? 1 : 0 });
                    }}
                />
            </td>
            <td>
                <PrimaryButton
                    type="button"
                    className="text-white bg-red-600"
                    onClick={remove}
                >
                    <Trash size={15} />
                </PrimaryButton>
                <input
                    type="hidden"
                    name={`bus-stop[${index}]`}
                    value={stop.uuid}
                />
            </td>
        </tr>
    );
}
