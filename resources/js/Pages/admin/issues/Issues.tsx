import DataTable from "@/Components/admin/DataTable";
import AdminView from "@/Layouts/admin/View";
import { Issue, Row } from "@/types";

export default function Issues({ issues }: { issues: Issue[] }) {
    const columns: Row[] = [
        {
            label: "Type",
            key: "type",
            type: "enum",
            enums: {
                incorrect_route: "Incorrect / Missing route information",
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
    const hasAction = false;

    return (
        <AdminView title="Issues">
            <DataTable
                columns={columns}
                hasSlNo={hasSlNo}
                hasAction={hasAction}
                data={issues}
                recordKey="id"
            />
        </AdminView>
    );
}
