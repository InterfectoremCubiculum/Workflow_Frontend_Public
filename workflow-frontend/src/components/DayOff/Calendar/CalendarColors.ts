import { DayOffRequestStatus } from "../../../enums/DayOffRequestStatus";

export const calendarColorDayOff = (event: any): React.CSSProperties =>
{
    let backgroundColor = "";

    switch (event.requestStatus) {
    case DayOffRequestStatus.Pending:
        backgroundColor = "#FFD700";
        break;
    case DayOffRequestStatus.Approved:
        backgroundColor = "#28a745";
        break;
    case DayOffRequestStatus.Rejected:
        backgroundColor = "#dc3545";
        break;
    case DayOffRequestStatus.Cancelled:
        backgroundColor = "#6c757d";
        break;
    case DayOffRequestStatus.Expired:
        backgroundColor = "#cbe1f5ff";
        break;
    default:
        backgroundColor = "#007bff"
    }

    return {
        backgroundColor,
        color: "white",
        borderRadius: "5px",
        border: "none",
        padding: "2px",
    }
}