import type { DayOffRequestStatus } from "../../../enums/DayOffRequestStatus";

export interface CalendarDayOffsRequestQueryParameters {
    from: string;
    to: string;
    dayOffRequestStatuses?: DayOffRequestStatus[] 
    userId: string;
}