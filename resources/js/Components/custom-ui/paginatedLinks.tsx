import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
import { FetchResponse } from "@/types";

export const PaginatedLinks = ({
    pagination,
    setPage,
}: {
    pagination: FetchResponse["pagination"];
    setPage: (page: number) => void;
}) => {
    const total = pagination.filtered_total;
    const per_page = pagination.per_page;
    const current_page = pagination.current_page;
    const totalPages = Math.ceil(total / per_page);

    if (totalPages < 1) {
        return null;
    }

    if (current_page > totalPages) {
        setPage(totalPages);
    }

    const getPageNumbers = () => {
        const pageNumbers = [] as {
            type: "ellipsis" | "page";
            value: number;
        }[];
        const showPages = 5;

        if (totalPages <= showPages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push({ type: "page", value: i });
            }
        } else {
            pageNumbers.push({ type: "page", value: 1 });
            if (current_page > 3) {
                pageNumbers.push({ type: "ellipsis", value: -1 });
            }
            const startPage = Math.max(2, current_page - 1);
            const endPage = Math.min(totalPages - 1, current_page + 1);
            for (let i = startPage; i <= endPage; i++) {
                if (i > 1 && i < totalPages) {
                    pageNumbers.push({ type: "page", value: i });
                }
            }
            if (current_page < totalPages - 2) {
                pageNumbers.push({ type: "ellipsis", value: -1 });
            }
            pageNumbers.push({ type: "page", value: totalPages });
        }

        return pageNumbers;
    };

    return (
        <Pagination className="w-auto mx-0">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() =>
                            current_page > 1 && setPage(current_page - 1)
                        }
                        className={
                            current_page === 1
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>

                {getPageNumbers().map((page, index) => {
                    if (page.type === "ellipsis") {
                        return (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    return (
                        <PaginationItem key={page.value}>
                            <PaginationLink
                                onClick={() => setPage(page.value)}
                                isActive={current_page === page.value}
                                className={
                                    current_page === page.value
                                        ? "bg-primary-focus"
                                        : "cursor-pointer"
                                }
                            >
                                {page.value}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                <PaginationItem>
                    <PaginationNext
                        onClick={() =>
                            current_page < totalPages &&
                            setPage(current_page + 1)
                        }
                        className={
                            current_page === totalPages
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};
