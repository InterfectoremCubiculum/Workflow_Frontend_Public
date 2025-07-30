import type { DayOffRequestStatus } from "../../../enums/DayOffRequestStatus";

export interface GetDayOffRequestDto {
    id: number;
    startDate: string;
    endDate: string;
    requestStatus: DayOffRequestStatus;
    requestDate: Date;
    userName: string;
    userSurname: string;
}