import type { DayOffRequestStatus } from "../../../enums/DayOffRequestStatus";

export interface GetCalendarDayOffDto {
    id: number;
    startDate: string;
    endDate: string;
    requestStatus: DayOffRequestStatus;
}