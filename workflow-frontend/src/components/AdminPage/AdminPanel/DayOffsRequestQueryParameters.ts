import type { DayOffRequestOrderBy } from "../../../enums/DayOffRequestOrderBy";
import type { DayOffRequestStatus } from "../../../enums/DayOffRequestStatus";

export interface DayOffsRequestQueryParameters {
    pageSize: number;
    pageNumber: number;
    sortBy: DayOffRequestOrderBy;
    sortOrder: "asc" | "desc";
    dayOffRequestStatuses?: DayOffRequestStatus[] 
    userId?: string;
}