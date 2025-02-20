export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};

type Row = {
    type?: "image" | "date" | "longtext" | "tag" | "enum" | "string" = "string";
    key: string;
    label: string;
} & (T extends "enum" ? { enums: Record<string, string> } : { enums?: never }) &
    (T extends "tags" ? { tags: Record<string, string> } : { tags?: never });

export type FetchResponse = {
    data: Row[];
    pagination: {
        current_page: number;
        per_page: number;
        total: number;
    };
};
type dbBool = 0 | 1;

export type LocationStop = {
    uuid: string;
    stop_description: string;
    is_two_way: dbBool;
    coordinates: string;
    created_at: Date;
    updated_at: Date;
};

export type Location = {
    uuid: string;
    location_name: string;
    address: string;
    bus_stops: LocationStop[];
    created_at: Date;
    updated_at: Date;
};

export type RouteStop = {
    uuid: string;
    order: number;
    location_id: string;
    bus_stop_id: string;
    location: Location;
    busStop: BusStop;
};

export type Route = {
    uuid: string;
    route_name: string;
    has_local: dbBool;
    has_govt: dbBool;
    has_express: dbBool;
    route_stops: RouteStop[];
    stop_count: number;
    created_at: Date;
    updated_at: Date;
};

export type RouteResults = Route & {
    stop_order: [number, number];
};

export type IndirectRoute = {
    route: Route & {
        boardingPoint: number;
    };
    switchingPoints: RouteStop[];
};

export const IssueOptions = {
    incorrect_route: "Incorrect / Missing route information",
    incorrect_location: "Incorrect / Missing location information",
    site_issue: "Broken UI / Bugs in application",
    other: "Other",
};

export type IssueOptionsType = keyof typeof IssueOptions;

export type Issue = {
    id: number;
    type: IssueOptionsType;
    description: string;
    image: string?;
    contact: string?;
    status: "open" | "closed";
    notes: string?;
    created_at: Date;
    updated_at: Date;
};
