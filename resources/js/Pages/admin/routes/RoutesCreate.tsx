import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AdminView from "@/Layouts/admin/View";
import { Location, Route, RouteStop } from "@/types";
import { useForm } from "@inertiajs/react";
import { ArrowDown, ArrowUp, Trash } from "lucide-react";
import { FormEventHandler } from "react";

export default function Routes({
    route: routeData,
    locations,
}: {
    route?: Route;
    locations: Location[];
}) {
    const newStop = {
        uuid: "",
        order: 0,
        location_id: "",
        bus_stop_id: "",
    } as RouteStop;

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        uuid: routeData?.uuid ?? "",
        routeName: routeData?.route_name ?? "",
        hasLocal: routeData?.has_local === 1,
        hasGovt: routeData?.has_govt === 1,
        hasExpress: routeData?.has_express === 1,
        routeStops: routeData?.route_stops ?? ([] as RouteStop[]),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        routeData
            ? patch(route("routes.update", { uuid: routeData.uuid }))
            : post(route("routes.store"));
    };

    return (
        <AdminView title="Routes" viewRoute="routes.view">
            <form onSubmit={submit}>
                <div className="mb-3 flex gap-4 flex-wrap">
                    <InputLabel
                        htmlFor="route-name"
                        value="Name"
                        className="w-52"
                    />
                    <TextInput
                        type="text"
                        name="route-name"
                        id="route-name"
                        value={data.routeName}
                        className="w-96"
                        autoComplete="off"
                        isFocused={true}
                        onChange={(e) => setData("routeName", e.target.value)}
                        required
                    />
                    <InputError message={errors.routeName} className="mt-2" />
                </div>
                <div className="mb-3 flex gap-4 flex-wrap">
                    <InputLabel
                        htmlFor="has-local"
                        value="Has Local"
                        className="w-52"
                    />
                    <input
                        type="checkbox"
                        name="has-local"
                        id="has-local"
                        checked={data.hasLocal}
                        onChange={(e) => setData("hasLocal", e.target.checked)}
                    />
                    <InputError message={errors.hasLocal} className="mt-2" />
                </div>
                <div className="mb-3 flex gap-4 flex-wrap">
                    <InputLabel
                        htmlFor="has-govt"
                        value="Has Govt"
                        className="w-52"
                    />
                    <input
                        type="checkbox"
                        name="has-govt"
                        id="has-govt"
                        checked={data.hasGovt}
                        onChange={(e) => setData("hasGovt", e.target.checked)}
                    />
                    <InputError message={errors.hasGovt} className="mt-2" />
                </div>
                <div className="mb-3 flex gap-4 flex-wrap">
                    <InputLabel
                        htmlFor="has-express"
                        value="Has Express"
                        className="w-52"
                    />
                    <input
                        type="checkbox"
                        name="has-express"
                        id="has-express"
                        checked={data.hasExpress}
                        onChange={(e) =>
                            setData("hasExpress", e.target.checked)
                        }
                    />
                    <InputError message={errors.hasExpress} className="mt-2" />
                </div>
                <div className="mb-3 flex gap-4 flex-wrap">
                    <InputLabel value="Bus Stops" className="w-52" />
                    <table className="w-1/3 flex-1">
                        <thead>
                            <tr>
                                <th>Location</th>
                                <th>Bus Stop</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.routeStops.map((stop, index) => (
                                <RouteStopRow
                                    index={index}
                                    stop={stop}
                                    key={index}
                                    set={(value: RouteStop) =>
                                        setData(
                                            "routeStops",
                                            data.routeStops.map((s, i) =>
                                                i === index ? value : s
                                            )
                                        )
                                    }
                                    remove={() => {
                                        const filtered = data.routeStops.filter(
                                            (s, i) => i !== index
                                        );
                                        setData("routeStops", filtered);
                                    }}
                                    moveUp={() => {
                                        setData(
                                            "routeStops",
                                            array_move(
                                                data.routeStops,
                                                index,
                                                Math.max(index - 1, 0)
                                            )
                                        );
                                    }}
                                    moveDown={() => {
                                        setData(
                                            "routeStops",
                                            array_move(
                                                data.routeStops,
                                                index,
                                                Math.min(
                                                    index + 1,
                                                    data.routeStops.length - 1
                                                )
                                            )
                                        );
                                    }}
                                    locations={locations}
                                />
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={4}>
                                    <SecondaryButton
                                        type="button"
                                        onClick={() =>
                                            setData(
                                                "routeStops",
                                                data.routeStops.concat([
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
                    <TextInput
                        type="hidden"
                        name="id"
                        value={routeData?.uuid}
                    />
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

function RouteStopRow({
    index,
    stop,
    locations,
    set,
    remove,
    moveUp,
    moveDown,
}: {
    index: number;
    stop: RouteStop;
    locations: Location[];
    set: (value: RouteStop) => void;
    remove: () => void;
    moveUp: () => void;
    moveDown: () => void;
}) {
    const locationOptions = { "": "Select Location" } as Record<string, string>;
    locations.forEach((loc) => {
        locationOptions[loc.uuid] = loc.location_name;
    });

    const stopOptions = { "": "Select Bus Stop" } as Record<string, string>;
    locations
        .find((loc) => loc.uuid === stop.location_id)
        ?.bus_stops.forEach((busStop) => {
            stopOptions[busStop.uuid] = busStop.stop_description;
        });

    return (
        <tr key={index}>
            <td>
                <SelectInput
                    name={`location-id[${index}]`}
                    value={stop.location_id}
                    options={locationOptions}
                    className="w-full"
                    onChange={(e) => {
                        set({ ...stop, location_id: e.target.value });
                    }}
                    required
                />
            </td>
            <td className="text-center">
                <SelectInput
                    name={`bus-stop-id[${index}]`}
                    value={stop.bus_stop_id ?? ""}
                    options={stopOptions}
                    className="w-full"
                    onChange={(e) => {
                        set({ ...stop, bus_stop_id: e.target.value });
                    }}
                />
            </td>
            <td>
                <SecondaryButton
                    type="button"
                    onClick={() => {
                        moveUp();
                    }}
                >
                    <ArrowUp size={15} />
                </SecondaryButton>
                <SecondaryButton
                    type="button"
                    onClick={() => {
                        moveDown();
                    }}
                >
                    <ArrowDown size={15} />
                </SecondaryButton>
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

function array_move(arr: any[], old_index: number, new_index: number) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
}
