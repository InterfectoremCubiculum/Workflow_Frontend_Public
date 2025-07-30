export const DayOffRequestOrderBy = {
    StartDate: "StartDate",
    EndDate: "EndDate",
    RequestDate: "RequestDate",
} as const;

export type DayOffRequestOrderBy = keyof typeof DayOffRequestOrderBy;
