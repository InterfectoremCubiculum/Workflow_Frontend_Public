export interface UserWorkSummaryDayByDayDto {
    userId: string;
    name: string;
    surname: string;
    email: string;
    date: string;
    teamName: string;
    projectName: string;
    workMinutes: number;
    breakMinutes: number;
}