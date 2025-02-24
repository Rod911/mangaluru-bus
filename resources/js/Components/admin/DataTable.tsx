import DangerButton from "@/Components/DangerButton";
import Dropdown from "@/Components/Dropdown";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { Button } from "@/Components/ui/button";
import { PaginatedLinks } from "@/Components/custom-ui/paginatedLinks";

import { Ban, Ellipsis, PencilLine, Trash } from "lucide-react";
import { FormEventHandler, useState } from "react";
import { useForm, router } from "@inertiajs/react";
import { FetchResponse, RowCol } from "@/types";

import {
    useQuery,
    QueryClient,
    QueryClientProvider,
    keepPreviousData,
} from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // default: true
        },
    },
});

type TableRow = Record<RowCol["key"], string | any> & {
    uuid?: string;
    id?: number;
};

function createQueryString(
    obj: { [x: string]: any },
    prefix: string = ""
): string {
    var str = [],
        p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            var k = prefix ? prefix + "[" + p + "]" : p,
                v = obj[p];
            str.push(
                v !== null && typeof v === "object"
                    ? createQueryString(v, k)
                    : encodeURIComponent(k) + "=" + encodeURIComponent(v)
            );
        }
    }
    return str.join("&");
}

function parseQueryString(str: string = location.search) {
    const urlParams = new URLSearchParams(str);
    const result: { [x: string]: any } = {};
    for (const [key, value] of urlParams.entries()) {
        const matches = key.match(/^([^\[]+)\[([^\]]+)\]$/);
        if (matches) {
            const parentKey = matches[1];
            const childKey = matches[2];
            if (!result[parentKey]) {
                result[parentKey] = {};
            }
            result[parentKey][childKey] = value;
        } else {
            result[key] = value;
        }
    }
    return result;
}

const urlParams = (parseQueryString().pagination || {}) as {
    page?: number;
    pageSize?: number;
    pageQuery?: string;
};

export default function DataTable({
    columns,
    hasSlNo,
    hasAction,
    tableData,
    paginate,
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
    columns: RowCol[];
    hasSlNo: boolean;
    hasAction: boolean;
    tableData?: TableRow[];
    paginate?: string;
    recordKey: string;
    tableName: string;
    editRoute?: string;
    deleteRoute?: string;
    pageSizes?: Record<string | number, number>;
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
                onSuccess: () => {
                    closeDeleteModal();
                    queryClient.refetchQueries({
                        queryKey: [tableName],
                    });
                },
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

    const [pageSize, setPageSize] = useState<number>(
        urlParams.pageSize || pageSizes[Object.keys(pageSizes)[0]]
    );
    const [pageQuery, setPageQuery] = useState<string>(
        urlParams.pageQuery || ""
    );

    return (
        <QueryClientProvider client={queryClient}>
            <div className="dtable">
                <div className="dtable-header flex justify-between mb-3">
                    <div className="dtable-param">
                        <SelectInput
                            className="dtable-page-size"
                            options={pageSizes}
                            onChange={(e) =>
                                setPageSize(Number(e.target.value))
                            }
                            value={pageSize}
                        />
                    </div>
                    <div className="dtable-param">
                        <TextInput
                            type="text"
                            className="dtable-search"
                            onChange={(e) => {
                                setPageQuery(e.target.value);
                            }}
                            value={pageQuery}
                        />
                    </div>
                </div>
                <div className="dtable-container">
                    <Dtable
                        tableName={tableName || ""}
                        pageSize={pageSize}
                        pageQuery={pageQuery}
                        paginate={paginate}
                        hasSlNo={hasSlNo}
                        columns={columns}
                        hasAction={hasAction}
                        openDeleteModal={openDeleteModal}
                        recordKey={recordKey}
                        deleteRoute={deleteRoute}
                        editRoute={editRoute}
                        tableData={tableData}
                    />
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
        </QueryClientProvider>
    );
}

function Dtable({
    tableName,
    pageSize,
    pageQuery,
    paginate,
    hasSlNo,
    columns,
    hasAction,
    recordKey,
    editRoute,
    deleteRoute,
    openDeleteModal,
    tableData,
}: {
    tableName: string;
    pageSize: number;
    pageQuery: string;
    paginate?: string;
    hasSlNo: boolean;
    columns: RowCol[];
    hasAction: boolean;
    recordKey: string;
    editRoute?: string;
    deleteRoute?: string;
    openDeleteModal: (record: TableRow) => void;
    tableData?: TableRow[];
}) {
    const fetchData = async (): Promise<FetchResponse | false> => {
        if (!paginate) return false;
        return await fetch(
            paginate +
                `?page=${page}` +
                `&pageSize=${pageSize}` +
                `&search=${pageQuery}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        )
            .then((response) => response.json())
            .then((result: FetchResponse) => {
                window.history.replaceState(
                    {},
                    "",
                    location.pathname +
                        "?" +
                        createQueryString({
                            pagination: {
                                page: result.pagination.current_page,
                                pageSize: result.pagination.per_page,
                                pageQuery: result.pagination.query,
                            },
                        })
                );
                return result;
            });
    };

    let pagination = {
        current_page: 1,
        total: 0,
        per_page: pageSize,
    } as FetchResponse["pagination"];

    const [page, setPage] = useState<number>(urlParams.page || 1);
    let pageStart = 0;

    const { isPending, isError, error, data, isFetching } = pagination
        ? useQuery({
              queryKey: [tableName, page, pageSize, pageQuery],
              queryFn: fetchData,
              placeholderData: keepPreviousData,
          })
        : {
              isPending: false,
              isError: false,
              error: null,
              isFetching: false,
              data: {
                  data: tableData,
                  pagination: pagination,
              },
          };
    if (data) {
        tableData = data.data;
        pagination = data.pagination;
        pageStart = (pagination.current_page - 1) * pagination.per_page;
    }

    function cell(row: TableRow, column: RowCol) {
        const content = row[column.key] as string;
        switch (column.type) {
            case "date":
                return new Date(content).toLocaleDateString();
            case "longtext":
                return content;
            case "tag":
                return (
                    <Button
                        className={
                            "px-2 py-1 rounded " + column.tags?.[content]
                        }
                        onClick={async () => {
                            if (column.actions?.[content]) {
                                const action =
                                    typeof column.actions[content] === "string"
                                        ? column.actions[content]
                                        : column.actions[content].path;
                                const params =
                                    typeof column.actions[content] === "string"
                                        ? { [recordKey]: row[recordKey] }
                                        : {
                                              [recordKey]: row[recordKey],
                                              ...column.actions[content].params,
                                          };
                                router.patch(route(action), params, {
                                    preserveState: true,
                                    headers: {
                                        "Content-Type": "application/json",
                                        Accept: "application/json",
                                    },
                                    onSuccess: () => {
                                        queryClient.refetchQueries({
                                            queryKey: [tableName],
                                        });
                                    },
                                });
                            }
                        }}
                    >
                        {content}
                    </Button>
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

    return (
        <>
            {isFetching && (
                <div className="text-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white py-4 px-8 shadow rounded-lg text-xl">
                    Loading...
                </div>
            )}
            <table className="w-full text-left dtable-table border-collapse bg-white">
                <thead>
                    <tr>
                        {hasSlNo && (
                            <th className="border px-2 py-1">Sl. No</th>
                        )}
                        {columns.map((column) => (
                            <th className="border px-2 py-1" key={column.key}>
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
                    {tableData?.length ? (
                        tableData.map((row, index) => (
                            <tr key={row[recordKey]}>
                                <td className="border px-2 py-1">
                                    {index + pageStart + 1}
                                </td>
                                {columns.map((column) => (
                                    <td
                                        className="border px-2 py-1"
                                        key={column.key}
                                    >
                                        {cell(row, column)}
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
                                                                        row[
                                                                            recordKey
                                                                        ],
                                                                    pagination:
                                                                        {
                                                                            page,
                                                                            pageSize,
                                                                            pageQuery,
                                                                        },
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
                                                            onClick={(e) => {
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
                                className="border px-2 py-1 text-center"
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
                {paginate && (
                    <tfoot>
                        <tr>
                            <td
                                colSpan={
                                    columns.length +
                                    (hasSlNo ? 1 : 0) +
                                    (hasAction ? 1 : 0)
                                }
                                className="border p-2"
                            >
                                <div className="flex justify-between items-center gap-2">
                                    {tableData && (
                                        <p>
                                            Showing {pageStart + 1} to{" "}
                                            {pageStart + tableData.length} of{" "}
                                            {pagination.total}
                                        </p>
                                    )}
                                    <PaginatedLinks
                                        pagination={pagination}
                                        setPage={setPage}
                                    />
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                )}
            </table>
        </>
    );
}
