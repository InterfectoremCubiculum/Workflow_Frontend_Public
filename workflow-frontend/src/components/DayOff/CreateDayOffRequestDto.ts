import type { DayOffRequestStatus } from "../../enums/DayOffRequestStatus";

export interface CreateDayOffRequestDto {
    startDate: string;
    endDate: string;
    requestStatus: DayOffRequestStatus;
}