export interface WorkSummaryQueriesParameters {
    periodStart: Date;
    periodEnd: Date;
    userIds: string[];
    isDayByDay: boolean;
}