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

type RowCol = {
    type?: "image" | "date" | "longtext" | "tag" | "enum" | "string" = "string";
    key: string;
    label: string;
} & (T extends "enum"
    ? {
          enums: Record<string, string>;
          tags?: never;
          actions?: never;
      }
    : {
          enums?: never;
      }) &
    (T extends "tags"
        ? {
              tags: Record<string, string>;
              actions: Record<
                  string,
                  string | { path: string; params: Record<string, string> }
              >;
              enums?: never;
          }
        : {
              tags?: never;
              actions?: never;
          });

export type FetchResponse = {
    data: RowCol[];
    pagination: {
        current_page: number;
        per_page: number;
        total: number;
        filtered_total: number;
        query: string;
    };
};

export type BusStop = {
    uuid: string;
    stop_description: string;
    is_two_way: boolean;
    coordinates?: { latitude: number; longitude: number };
    created_at: Date;
    updated_at: Date;
};

export type Location = {
    uuid: string;
    location_name: string;
    address: string;
    bus_stops: BusStop[];
    created_at: Date;
    updated_at: Date;
    url_slug: string;
};

export type LocationDetails = Location & {
    routes: (Route & {
        laravel_through_key: Location["uuid"];
    })[];
    bus_stops: BusStop[];
};

export type RouteStop = {
    uuid: string;
    order: number;
    location_id: string;
    bus_stop_id?: string;
    location: Location;
    bus_stop?: BusStop;
    default_bus_stop?: BusStop;
};

export type Route = {
    uuid: string;
    route_name: string;
    has_local: boolean;
    has_govt: boolean;
    has_express: boolean;
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
    image?: string;
    contact?: string;
    status: "open" | "closed";
    notes?: string;
    created_at: Date;
    updated_at: Date;
};

export type PopularLocation = {
    type: "location" | "route";
    from_location?: Location;
    to_location?: Location;
    route?: string;
};
