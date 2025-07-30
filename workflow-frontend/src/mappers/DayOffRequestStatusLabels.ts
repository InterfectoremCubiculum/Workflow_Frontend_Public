import type { DayOffRequestStatus } from "../enums/DayOffRequestStatus";

const DayOffRequestStatusLabels: Record<DayOffRequestStatus, string> = {
    Pending: "Pending",
    Approved: "Approved",
    Rejected: "Rejected",
    Cancelled: "Cancelled",
    Completed: "Completed",
    Expired: "Expired",
};
export default DayOffRequestStatusLabels;