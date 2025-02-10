import DataTable from "@/Components/admin/DataTable";
import AdminView from "@/Layouts/admin/View";
import { Location, Row } from "@/types";

export default function Locations({ locations }: { locations: Location[] }) {
    const columns = [
        { label: "Location Name", key: "location_name" },
        { label: "Address", key: "address" },
    ] as Row[];
    const hasSlNo = true;
    const hasAction = true;

    return (
        <AdminView title="Locations" addRoute="locations.create">
            <DataTable
                columns={columns}
                hasSlNo={hasSlNo}
                hasAction={hasAction}
                data={locations}
                recordKey="uuid"
                tableName="location"
                editRoute="locations.edit"
                deleteRoute="locations.destroy"
            />
        </AdminView>
    );
}
