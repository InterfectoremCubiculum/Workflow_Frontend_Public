import type { DayOffRequestStatus } from "../../enums/DayOffRequestStatus";

export interface UpdateDayOffRequestDto {
    id: number;
    startDate: string;
    endDate: string;
    requestStatus: DayOffRequestStatus;
}