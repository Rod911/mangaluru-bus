import DataTable from "@/Components/admin/DataTable";
import AdminView from "@/Layouts/admin/View";
import { RowCol } from "@/types";

export default function Routes() {
    const columns = [
        { label: "Route Name", key: "route_name" },
        { label: "Stops", key: "stop_count" },
        // { label: "Address", key: "address" },
    ] as RowCol[];
    const hasSlNo = true;
    const hasAction = true;

    return (
        <AdminView title="Routes" addRoute="routes.create">
            <DataTable
                columns={columns}
                hasSlNo={hasSlNo}
                hasAction={hasAction}
                paginate={route("routes.paginate")}
                recordKey="uuid"
                tableName="route"
                editRoute="routes.edit"
                deleteRoute="routes.destroy"
            />
        </AdminView>
    );
}
