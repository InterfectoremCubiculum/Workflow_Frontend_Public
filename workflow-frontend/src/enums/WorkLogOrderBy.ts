export const WorkLogOrderBy = {
    Date: "Date",
    StartTime: "StartTime",
    EndTime: "EndTime",
    WorkingStatus: "WorkingStatus",
} as const;

export type WorkLogOrderBy = keyof typeof WorkLogOrderBy;
