import DangerButton from "@/Components/DangerButton";
import Dropdown from "@/Components/Dropdown";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";

import { Ban, Ellipsis, PencilLine, Trash } from "lucide-react";
import { FormEventHandler, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Row } from "@/types";

type TableRow = Record<Row["key"], string | any> & {
    uuid?: string;
    id?: number;
};

export default function DataTable({
    columns,
    hasSlNo,
    hasAction,
    data,
    recordKey,
    tableName,
    editRoute,
    deleteRoute,
    pageSizes = {
        10: 10,
        25: 25,
        50: 50,
        100: 100,
    },
}: {
    columns: Row[];
    hasSlNo: boolean;
    hasAction: boolean;
    data: TableRow[];
    recordKey: string;
    tableName?: string;
    editRoute?: string;
    deleteRoute?: string;
    pageSizes?: Record<number, string | number>;
}) {
    const form = useForm({});
    const deleteRecord: FormEventHandler = (e) => {
        e.preventDefault();
        if (!deleteRoute || !recordToDelete) return;
        form.delete(
            route(deleteRoute, {
                [recordKey]: recordToDelete[recordKey],
            }),
            {
                onSuccess: () => closeDeleteModal(),
            }
        );
    };

    const [confirmingRecordDeletion, setConfirmingRecordDeletion] =
        useState(false);
    const [recordToDelete, setRecordToDelete] = useState<TableRow | null>(null);
    const openDeleteModal = (record: TableRow) => {
        setConfirmingRecordDeletion(true);
        setRecordToDelete(record);
    };
    const closeDeleteModal = () => {
        setConfirmingRecordDeletion(false);
    };

    return (
        <>
            <div className="dtable">
                <div className="dtable-header flex justify-between mb-3">
                    <div className="dtable-param">
                        <SelectInput
                            className="dtable-page-size"
                            options={pageSizes}
                        />
                    </div>
                    <div className="dtable-param">
                        <TextInput type="text" className="dtable-search" />
                    </div>
                </div>
                <div className="dtable-container">
                    <table className="w-full text-left dtable-table border-collapse bg-white">
                        <thead>
                            <tr>
                                {hasSlNo && (
                                    <th className="border px-2 py-1">Sl. No</th>
                                )}
                                {columns.map((column) => (
                                    <th
                                        className="border px-2 py-1"
                                        key={column.key}
                                    >
                                        {column.label}
                                    </th>
                                ))}
                                {hasAction && (
                                    // <th className="text-right">Action</th>
                                    <th className="border px-2 py-1"></th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length ? (
                                data.map((row, index) => (
                                    <tr key={row[recordKey]}>
                                        <td className="border px-2 py-1">
                                            {index + 1}
                                        </td>
                                        {columns.map((column) => (
                                            <td
                                                className="border px-2 py-1"
                                                key={column.key}
                                            >
                                                {cell(row[column.key], column)}
                                            </td>
                                        ))}
                                        {hasAction && (
                                            <td className="border px-2 py-1 text-right">
                                                <div className="dtable-actions">
                                                    <Dropdown>
                                                        <Dropdown.Trigger>
                                                            <button className="dtable-delete">
                                                                <Ellipsis />
                                                            </button>
                                                        </Dropdown.Trigger>
                                                        <Dropdown.Content>
                                                            {editRoute && (
                                                                <Dropdown.Link
                                                                    href={route(
                                                                        editRoute,
                                                                        {
                                                                            [recordKey]:
                                                                                row.uuid,
                                                                        }
                                                                    )}
                                                                    className="flex gap-3"
                                                                >
                                                                    <PencilLine color="#e9aa3a" />
                                                                    Edit
                                                                </Dropdown.Link>
                                                            )}
                                                            {deleteRoute && (
                                                                <Dropdown.Link
                                                                    href="#"
                                                                    className="flex gap-3"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        openDeleteModal(
                                                                            row
                                                                        );
                                                                    }}
                                                                >
                                                                    <Trash color="red" />
                                                                    Delete
                                                                </Dropdown.Link>
                                                            )}
                                                            {/* <Dropdown.Link
                                                                href="#"
                                                                className="flex gap-3"
                                                            >
                                                                <Ban />
                                                                Inactive
                                                            </Dropdown.Link> */}
                                                        </Dropdown.Content>
                                                    </Dropdown>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        className="border px-2 py-1"
                                        colSpan={
                                            columns.length +
                                            (hasSlNo ? 1 : 0) +
                                            (hasAction ? 1 : 0)
                                        }
                                    >
                                        No Record Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal show={confirmingRecordDeletion} onClose={closeDeleteModal}>
                <form onSubmit={deleteRecord} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Are you sure you want to delete this {tableName}?
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        This action is irreversible.
                    </p>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeDeleteModal}>
                            Cancel
                        </SecondaryButton>

                        <DangerButton
                            className="ms-3"
                            disabled={form.processing}
                        >
                            Yes, Delete
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </>
    );
}

function cell(content: string, column: Row) {
    switch (column.type) {
        case "date":
            return new Date(content).toLocaleDateString();
        case "longtext":
            return content;
        case "tag":
            return (
                <span className={"px-2 py-1 rounded " + column.tags?.[content]}>
                    {content}
                </span>
            );
        case "enum":
            return column.enums?.[content];
        case "image":
            const url = "/storage/" + content;
            return (
                content && (
                    <a href={url} target="_blank">
                        <img src={url} height={50} width={50} />
                    </a>
                )
            );
        default:
            return content;
    }
}
