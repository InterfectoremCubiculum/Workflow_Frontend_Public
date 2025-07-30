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
    const [userId, setUserId] = useState<string | undefined>(undefined);

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
            <h2 className="text-xl font-bold mb-4">Day Off Requests</h2>
            <div className="mb-3 row">
                <div className="col-12 col-lg-2 text-start mb-3">
                    <label className="mb-1">Sort by:</label>
                    <Select
                        options={sortOptions}
                        value={sortOptions.find(option => option.value === sortBy)}
                        onChange={(selected) => {
                            if (selected) {
                                setSortBy(selected.value as keyof typeof DayOffRequestOrderBy);
                            }
                        }}
                    />
                    <label className="mt-3 mb-1">Sort order:</label>
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
                <div className="col-12 col-lg-10 d-flex">
                    <div className="w-100">
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            
                            <ul className="">
                                {dayOffs.map((dayOff) => (
                                    <li key={dayOff.id} className="border p-2 rounded">
                                        <p>
                                            <strong>Start:</strong> {dayOff.startDate} 
                                            | <strong>End:</strong> {dayOff.endDate}
                                            | <strong>Status:</strong> {DayOffRequestStatusLabels[dayOff.requestStatus]}
                                            | <strong>Requested on:</strong> {new Date(dayOff.requestDate).toLocaleDateString()}
                                            | <strong>Requested by:</strong> {dayOff.userName} {dayOff.userSurname}
                                            <Button variant="success" className="me-3" onClick={() => handleStatusChange(dayOff.id, DayOffRequestStatus.Approved)}>Approved</Button>
                                            <Button variant="danger" onClick={() => handleStatusChange(dayOff.id, DayOffRequestStatus.Rejected)}>Reject</Button>
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                        </div>
                </div>
            </div>
        </div>
    );
};

export default DayOffAdminPanel;
