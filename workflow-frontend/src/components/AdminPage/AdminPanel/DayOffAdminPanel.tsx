import React, { useEffect, useState } from "react";
import Select from "react-select";
import type { GetDayOffRequestDto } from "./GetDayOffRequestDto";
import { changeDayOffRequestStatus, getDayOffRequests } from "../../../services/dayOffService";
import type { DayOffsRequestQueryParameters } from "./DayOffsRequestQueryParameters";
import { DayOffRequestOrderBy } from "../../../enums/DayOffRequestOrderBy"; // zakładam, że enum lub obiekt jest gdzieś zdefiniowany
import DayOffRequestStatusLabels from "../../../mappers/DayOffRequestStatusLabels";
import { Button } from "react-bootstrap";
import { DayOffRequestStatus } from "../../../enums/DayOffRequestStatus";

const DayOffAdminPanel: React.FC = () => {
    const [dayOffs, setDayOffs] = useState<GetDayOffRequestDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sortBy, setSortBy] = useState<keyof typeof DayOffRequestOrderBy>("StartDate");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [userId] = useState<string | undefined>(undefined);

    const sortOptions = [
        { value: "StartDate", label: "Start Date" },
        { value: "EndDate", label: "End Date" },
        { value: "RequestDate", label: "Request Date" },
    ];

    const sortOrderOptions = [
        { value: "asc", label: "Ascending" },
        { value: "desc", label: "Descending" },
    ];

    useEffect(() => {
        fetchDayOffs({
            pageSize: 10,
            pageNumber: 1,
            sortBy: sortBy as any,
            dayOffRequestStatuses: ["Pending"],
            sortOrder: sortOrder,
        });
    }, [sortBy, sortOrder, userId]);

    const fetchDayOffs = async (params: DayOffsRequestQueryParameters) => {
        try {
            setLoading(true);
            const response = await getDayOffRequests(params);
            setDayOffs(response.items);
        } catch (error) {
            console.error("Error fetching day off requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (reqeustId: number, status: string) => {
        try {
            await changeDayOffRequestStatus(reqeustId, status).then(() => {
                fetchDayOffs({
                    pageSize: 10,
                    pageNumber: 1,
                    sortBy: sortBy as any,
                    dayOffRequestStatuses: ["Pending"],
                    sortOrder: sortOrder,
                });
            });
        } catch (error) {
            console.error("Error changing day off request status:", error);
        }
    }
 
    return (
    <div>
        <h2 className="fs-4 fw-bold mb-4">Day Off Requests</h2>

        <div className="row mb-4">
        <div className="col-12 col-lg-3 mb-4 mb-lg-0">
            <div className="mb-3">
            <label className="form-label fw-semibold">Sort by:</label>
            <Select
                options={sortOptions}
                value={sortOptions.find(option => option.value === sortBy)}
                onChange={(selected) => {
                if (selected) {
                    setSortBy(selected.value as keyof typeof DayOffRequestOrderBy);
                }
                }}
            />
            </div>

            <div>
            <label className="form-label fw-semibold">Sort order:</label>
            <Select
                options={sortOrderOptions}
                value={sortOrderOptions.find(option => option.value === sortOrder)}
                onChange={(selected) => {
                if (selected) {
                    setSortOrder(selected.value as "asc" | "desc");
                }
                }}
            />
            </div>
        </div>

        <div className="col-12 col-lg-9">
            {loading ? (
            <p className="text-center text-muted">Loading...</p>
            ) : (
            <ul className="list-group">
                {dayOffs.map((dayOff) => (
                <li key={dayOff.id} className="list-group-item rounded mb-3 shadow-sm">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                    <div className="mb-2 mb-md-0">
                        <p className="mb-1">
                            <strong>Start:</strong> {dayOff.startDate} &nbsp;|&nbsp; 
                            <strong>End:</strong> {dayOff.endDate} &nbsp;|&nbsp; 
                            <strong>Status:</strong> {DayOffRequestStatusLabels[dayOff.requestStatus]} &nbsp;|&nbsp; 
                            <strong>Requested on:</strong> {new Date(dayOff.requestDate).toLocaleDateString()} &nbsp;|&nbsp; 
                            <strong>Requested by:</strong> {dayOff.userName} {dayOff.userSurname}
                        </p>
                    </div>

                    <div>
                       <Button
                            variant="success"
                            className="me-2 mb-2 btn-sm"
                            style={{ minWidth: "100px" }}
                            onClick={() => handleStatusChange(dayOff.id, DayOffRequestStatus.Approved)}
                            >
                            Approve
                        </Button>
                        <Button
                            variant="danger"
                            className="btn-sm"
                            style={{ minWidth: "100px" }}
                            onClick={() => handleStatusChange(dayOff.id, DayOffRequestStatus.Rejected)}
                            >
                            Reject
                        </Button>
                    </div>
                    </div>
                </li>
                ))}
            </ul>
            )}
        </div>
        </div>
    </div>
    )
}

export default DayOffAdminPanel;
