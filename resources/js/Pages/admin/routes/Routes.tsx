import DataTable from "@/Components/admin/DataTable";
import AdminView from "@/Layouts/admin/View";
import { Route, Row } from "@/types";

export default function Routes({ routes }: { routes: Route[] }) {
    const columns = [
        { label: "Route Name", key: "route_name" },
        { label: "Stops", key: "stop_count" },
        // { label: "Address", key: "address" },
    ] as Row[];
    const hasSlNo = true;
    const hasAction = true;

    return (
        <AdminView title="Routes" addRoute="routes.create">
            <DataTable
                columns={columns}
                hasSlNo={hasSlNo}
                hasAction={hasAction}
                data={routes}
                recordKey="uuid"
                tableName="route"
                editRoute="routes.edit"
                deleteRoute="routes.destroy"
            />
        </AdminView>
    );
}
