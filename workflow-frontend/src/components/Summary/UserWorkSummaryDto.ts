export interface UserWorkSummaryDto {
    userId: string;
    name: string;
    surname: string;
    teamName: string;
    projectName: string;
    totalWorkHours: number;
    totalBreakHours: number;
    totalDaysWorked: number;
    totalDaysOff: number;
}