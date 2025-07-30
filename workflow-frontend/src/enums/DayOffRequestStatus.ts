export const DayOffRequestStatus = {
    Pending: "Pending",
    Approved: "Approved",
    Rejected: "Rejected",
    Cancelled: "Cancelled",
    Completed: "Completed",
    Expired: "Expired",
} as const;

export type DayOffRequestStatus = keyof typeof DayOffRequestStatus;
