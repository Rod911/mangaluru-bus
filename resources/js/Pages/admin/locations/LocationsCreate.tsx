import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import AdminView from "@/Layouts/admin/View";
import { Location, BusStop } from "@/types";
import { useForm } from "@inertiajs/react";
import { MapPinnedIcon, Trash } from "lucide-react";
import { FormEventHandler } from "react";
import LeafletMap from "@/Components/LeafletMap";

export default function Locations({ location }: { location?: Location }) {
    const newStop = {
        uuid: "",
        stop_description: "",
        is_two_way: false,
    } as BusStop;

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        uuid: location?.uuid ?? "",
        locationName: location?.location_name ?? "",
        locationAddress: location?.address ?? "",
        busStops: location?.bus_stops ?? ([] as BusStop[]),
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
                                <th>Lat</th>
                                <th>Lon</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.busStops.map((stop, index) => (
                                <LocationStopRow
                                    index={index}
                                    stop={stop}
                                    key={index}
                                    set={(value) =>
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

const coordinatesPrecision = 13;

function LocationStopRow({
    index,
    stop,
    set,
    remove,
}: {
    index: number;
    stop: BusStop;
    set: (value: BusStop) => void;
    remove: () => void;
}) {
    const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData?.getData("text");
        if (text) {
            const [latitude, longitude] = text.split(",");
            if (!latitude || !longitude) return;
            e.preventDefault();
            set({
                ...stop,
                coordinates: {
                    latitude: parseFloat(
                        latitude.substring(0, coordinatesPrecision)
                    ),
                    longitude: parseFloat(
                        longitude.substring(0, coordinatesPrecision)
                    ),
                },
            });
        }
    };
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
                    // required
                />
            </td>
            <td className="text-center">
                <input
                    type="checkbox"
                    name={`is_two_way[${index}]`}
                    value="1"
                    defaultChecked={stop.is_two_way}
                    className="w-6 h-6 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    autoComplete="off"
                    onChange={(e) => {
                        set({ ...stop, is_two_way: e.target.checked });
                    }}
                />
            </td>
            <td>
                <TextInput
                    type="text"
                    name={`latitude[${index}]`}
                    value={stop.coordinates?.latitude || ""}
                    className="w-full"
                    autoComplete="off"
                    onChange={(e) => {
                        set({
                            ...stop,
                            coordinates: {
                                ...stop.coordinates,
                                latitude: parseFloat(e.target.value),
                                longitude: stop.coordinates?.longitude || 0,
                            },
                        });
                    }}
                    onPaste={onPaste}
                    maxLength={coordinatesPrecision}
                />
            </td>
            <td>
                <TextInput
                    type="text"
                    name={`longitude[${index}]`}
                    value={stop.coordinates?.longitude || ""}
                    className="w-full"
                    autoComplete="off"
                    onChange={(e) => {
                        set({
                            ...stop,
                            coordinates: {
                                ...stop.coordinates,
                                longitude: parseFloat(e.target.value),
                                latitude: stop.coordinates?.latitude || 0,
                            },
                        });
                    }}
                    onPaste={onPaste}
                    maxLength={coordinatesPrecision}
                />
            </td>
            <td>
                <Popover>
                    <PopoverTrigger asChild>
                        <PrimaryButton
                            type="button"
                            className="text-white bg-primary py-2.5"
                        >
                            <MapPinnedIcon size={20} />
                        </PrimaryButton>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 h-80 p-1">
                        {/* <iframe src={`https://maps.google.com/maps?q=${stop.coordinates?.latitude},${stop.coordinates?.longitude}&z=15&output=embed&disableDefaultUI=true`} width="100%" height="100%" className="w-full h-full rounded block"></iframe> */}
                        <LeafletMap
                            positions={[
                                {
                                    pos: {
                                        lat: stop.coordinates?.latitude || 0,
                                        lng: stop.coordinates?.longitude || 0,
                                    },
                                    label: stop.stop_description,
                                },
                            ]}
                            zoom={16}
                        />
                    </PopoverContent>
                </Popover>
                <PrimaryButton
                    type="button"
                    className="text-white bg-red-600 py-2.5"
                    onClick={remove}
                >
                    <Trash size={20} />
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
