import DataTable from "@/Components/admin/DataTable";
import AdminView from "@/Layouts/admin/View";
import { Issue, Row } from "@/types";

export default function Issues() {
    const columns: Row[] = [
        {
            label: "Type",
            key: "type",
            type: "enum",
            enums: {
                incorrect_route: "Incorrect / Missing route information",
                incorrect_location: "Incorrect / Missing location information",
                site_issue: "Broken UI / Bugs in application",
                other: "Other",
            },
        },
        { label: "Description", key: "description" },
        { label: "Image", key: "image", type: "image" },
        { label: "Contact", key: "contact", type: "longtext" },
        {
            label: "Status",
            key: "status",
            type: "tag",
            tags: {
                open: "bg-red-500 text-white",
                closed: "bg-green-500 text-white",
            },
        },
        { label: "Notes", key: "notes", type: "longtext" },
        { label: "Created", key: "created_at", type: "date" },
        { label: "Updated", key: "updated_at", type: "date" },
    ];
    const hasSlNo = true;
    const hasAction = true;

    return (
        <AdminView title="Issues">
            <DataTable
                columns={columns}
                hasSlNo={hasSlNo}
                hasAction={hasAction}
                tableName="issue"
                paginate={route("issues.paginate")}
                recordKey="id"
                deleteRoute="issues.destroy"
            />
        </AdminView>
    );
}
