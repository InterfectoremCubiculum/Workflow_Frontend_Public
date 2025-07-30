import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useEffect, useMemo, useState } from "react";
import { enUS } from "date-fns/locale";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { changeDayOffRequestStatus, createBreak, deleteDayOffRequest, getDayOffsForCalendar, updateDayOffRequestStatus } from "../../../services/dayOffService";
import type { CalendarDayOffsRequestQueryParameters } from "./CalendarDayOffsRequestQueryParameters";
import { DayOffRequestStatus } from "../../../enums/DayOffRequestStatus";
import type { GetCalendarDayOffDto } from "./GetCalendarDayOffDto";
import Select from "react-select";
import type { UpdateDayOffRequestDto } from "../UpdateDayOffRequestDto";
import { calendarColorDayOff } from "./CalendarColors";
import { useUser } from "../../../contexts/UserContext";

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const DayOffsManager: React.FC = () => {
    const [dayOffs, setDayOffs] = useState<GetCalendarDayOffDto[] | undefined>(undefined);
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(new Date().getFullYear(), 11, 31),
    });
    const [selectedStatuses, setSelectedStatuses] = useState<DayOffRequestStatus[]>([DayOffRequestStatus.Approved]);
    const statusOptions = Object.keys(DayOffRequestStatus).map((key) => ({
        value: key as DayOffRequestStatus,
        label: key,
    }));
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    const [updateCalendar, setUpdateCalendar] = useState<GetCalendarDayOffDto | null>(null);

    const { user } = useUser();

    useEffect(() => {
        if (user !== null) {
            fetchDayOffs({
                from: dateRange.from.toISOString().split('T')[0],
                to: dateRange.to.toISOString().split('T')[0],
                userId: user.userId,
                dayOffRequestStatuses: selectedStatuses
            })
        }
    }, [dateRange, selectedStatuses]);

    const fetchDayOffs = async (params: CalendarDayOffsRequestQueryParameters) => {
        try {
            await getDayOffsForCalendar(params).then((calendarDayOffDto) => {
                setDayOffs(calendarDayOffDto);
            })
        } catch (error) {
            console.error("Error fetching day offs:", error);
        }
    };

    const events = useMemo(() => {
        return dayOffs?.map(request => ({
        id: request.id,
        title: `Break - ${request.requestStatus}`,
        start: new Date(request.startDate),
        end: new Date(request.endDate),
        allDay: true,
        requestStatus: request.requestStatus,
        })) || [];
    }, [dayOffs]);

    const handleRangeChange = (range: any) => {
        if (Array.isArray(range) && range.length > 0) {
            const sortedRange = range.sort((a, b) => a.getTime() - b.getTime());
            setDateRange({
                from: sortedRange[0],
                to: sortedRange[sortedRange.length - 1],
            });
        } else if (range.start && range.end) {
            setDateRange({
                from: range.start,
                to: range.end,
            });
        }
    };

    const handleSelectSlot = async (slotInfo: { start: Date; end: Date; action: string }) => {

        const correctStart = new Date(slotInfo.start);
        correctStart.setDate(correctStart.getDate() + 1);
        const confirmCreate = window.confirm(`Do you want add break from ${correctStart.toISOString().split('T')[0]} to ${slotInfo.end.toISOString().split('T')[0]}?`);
        if (confirmCreate) {
            await createBreak({
                startDate: correctStart.toISOString().split('T')[0],
                endDate: slotInfo.end.toISOString().split('T')[0],
                requestStatus: DayOffRequestStatus.Pending}).then((data) => {
                    setDayOffs(prev => prev ? [...prev, data] : [data]);
                })
        }
    };
    const handleSelectEvent = (event: any) => {
        setUpdateCalendar({
            id: event.id,
            startDate: event.start.toISOString().split('T')[0],
            endDate: event.end.toISOString().split('T')[0],
            requestStatus: event.requestStatus,})
        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you really want delete to delete?");
        if (confirmDelete) {
            try {
                await deleteDayOffRequest(selectedEvent.id).then(() => {
                    setDayOffs(prev => prev?.filter(e => e.id !== selectedEvent.id));
                    setShowModal(false);
                    setUpdateCalendar(null)
                });
            } catch (error) {
                console.error("Error deleting event:", error);
                
            }
            setShowModal(false);
        }
    };

    
    const handleSave = async () => {
        const confirmDelete = window.confirm("Are you really want update?");
        if (confirmDelete) {
            try {
                var params: UpdateDayOffRequestDto = {
                    id: selectedEvent.id,
                    startDate: updateCalendar?.startDate || selectedEvent.start.toISOString().split('T')[0],
                    endDate: updateCalendar?.endDate || selectedEvent.end.toISOString().split('T')[0],
                    requestStatus: DayOffRequestStatus.Pending,
                }
                await updateDayOffRequestStatus(params).then(() => {
                    setShowModal(false);
                    setDayOffs(prev => prev?.map(e => e.id === selectedEvent.id ? { ...e, ...params } : e));
                });
            } catch (error) {
                console.error("Error updating event:", error);
                
            }
        }
    };

    const handleChangeStatus = async (status: DayOffRequestStatus) => {
        setShowModal(false);
        await changeDayOffRequestStatus(selectedEvent.id, status).then(() => {
            setDayOffs(prev => prev?.map(e => e.id === selectedEvent.id ? { ...e, requestStatus: status } : e));

       })
    }
    return (
        <>
            <div className="mt-3" style={{ width: "300px" }}>
                <label>Status:</label>
                <Select
                    styles={{
                        menu: (provided) => ({
                            ...provided,
                            zIndex: 1000,
                        }),
                    }}
                    options={statusOptions}
                    isMulti
                    value={statusOptions.filter(option => selectedStatuses.includes(option.value))}
                    onChange={(selectedOptions) => {
                        setSelectedStatuses(selectedOptions.map(option => option.value));
                    }}
                    placeholder="Wybierz statusy"
                    closeMenuOnSelect={false}
                />
            </div>
            <div className="mt-3 mb-5" style={{ height: '100vh' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    defaultView="month"
                    onRangeChange={handleRangeChange}
                    startAccessor="start"
                    endAccessor="end"
                    views={['month', 'week', 'day']}
                    selectable
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={(event) => ({ style: calendarColorDayOff(event) })}
                />
            </div>
            {selectedEvent && updateCalendar && (
                <div className={`modal ${showModal ? 'd-block show' : ''}`} tabIndex={-1} role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Manager your Break</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Title:</strong> {selectedEvent.title}</p>
                                
                                <div className="mb-3">
                                    <label className="form-label"><strong>From:</strong></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={new Date(updateCalendar!.startDate).toISOString().split('T')[0]}
                                        disabled=
                                        {
                                            selectedEvent.requestStatus === DayOffRequestStatus.Cancelled
                                            || selectedEvent.requestStatus === DayOffRequestStatus.Expired
                                            || selectedEvent.requestStatus === DayOffRequestStatus.Completed
                                        }
                                        onChange={(e) =>
                                            setUpdateCalendar((prev: any) => ({
                                                ...prev,
                                                startDate: new Date(e.target.value).toISOString().split('T')[0],
                                            }))
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label"><strong>To:</strong></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={new Date(updateCalendar!.endDate).toISOString().split('T')[0]}
                                        disabled=
                                        {
                                            selectedEvent.requestStatus === DayOffRequestStatus.Cancelled
                                            || selectedEvent.requestStatus === DayOffRequestStatus.Expired
                                            || selectedEvent.requestStatus === DayOffRequestStatus.Completed
                                        }
                                        onChange={(e) =>
                                            setUpdateCalendar((prev: any) => ({
                                                ...prev,
                                                endDate: new Date(e.target.value).toISOString().split('T')[0],
                                            }))
                                        }
                                    />
                                </div>

                                <div className="mb-3">
                                    <h6>Status:</h6>
                                    { updateCalendar?.requestStatus}
                                </div>
                            </div>
                            <div className="modal-footer">
                                { (selectedEvent.requestStatus === DayOffRequestStatus.Pending || selectedEvent.requestStatus === DayOffRequestStatus.Rejected ) && (
                                    <button type="button" className="btn btn-danger" onClick={() => handleDelete()}>Delete</button>
                                )}
                                { (selectedEvent.requestStatus === DayOffRequestStatus.Approved)&& (
                                    <button type="button" className="btn btn-danger" onClick={() => handleChangeStatus(DayOffRequestStatus.Cancelled)}>Cancel Break</button>
                                )}
                                { (selectedEvent.requestStatus === DayOffRequestStatus.Pending || selectedEvent.requestStatus === DayOffRequestStatus.Rejected || selectedEvent.requestStatus === DayOffRequestStatus.Approved) && (
                                    <button type="button" className="btn btn-secondary" onClick={() => handleSave()}>
                                        {
                                            selectedEvent.requestStatus === DayOffRequestStatus.Approved 
                                            || selectedEvent.requestStatus === DayOffRequestStatus.Pending ? 
                                            "Change" :"Reopen"
                                        }
                                    </button>
                                )}
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
};

export default DayOffsManager;