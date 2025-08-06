import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { useEffect, useMemo, useState } from "react";
import { enUS } from "date-fns/locale";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { getDayOffsForCalendar } from "../../../services/dayOffService";
import type { CalendarDayOffsRequestQueryParameters } from "./CalendarDayOffsRequestQueryParameters";
import UserSearch from "../../Searchings/UserSearching/UserSearch";
import type { GetCalendarDayOffDto } from "./GetCalendarDayOffDto";
import { calendarColorDayOff } from "./CalendarColors";
import { DayOffRequestStatus } from "../../../enums/DayOffRequestStatus";

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

const DayOffsViewer: React.FC = () => {
    const [choosenUser, setUserId] = useState<string | null>(null);
    const [dayOffs, setDayOffs] = useState<GetCalendarDayOffDto[] | undefined>(undefined);
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(new Date().getFullYear(), 11, 31),
    });
    useEffect(() => {
        if (choosenUser !== null) {
            fetchDayOffs({
                from: dateRange.from.toISOString().split('T')[0],
                to: dateRange.to.toISOString().split('T')[0],
                userId: choosenUser,
                dayOffRequestStatuses: [
                    DayOffRequestStatus.Approved,
                    DayOffRequestStatus.Completed,
                    DayOffRequestStatus.Pending,
                    DayOffRequestStatus.Cancelled,
                ]
        })
        }
    }, [choosenUser, dateRange]);

    const handleUserSelect = (userId: string | null) => {
        setUserId(userId || null);
    }
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

    const highlightWeekends = (date: Date) => {
        const day = date.getDay();
        if (day === 0 || day === 6) {
        return {
            style: {
            backgroundColor: "#f8d7da",
            },
        };
        }
        return {};
    };

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

    return (
        <>
            <div className="mt-3"><UserSearch onUserSelect={handleUserSelect}></UserSearch></div>
            <div className="mt-3" style={{ height: '80vh' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    defaultView="month"
                    dayPropGetter={highlightWeekends}
                    onRangeChange={handleRangeChange}
                    startAccessor="start"
                    endAccessor="end"
                    views={['month', 'week', 'day']}
                    eventPropGetter={(event) => ({ style: calendarColorDayOff(event) })}
                />
            </div>
        </>
    )
};

export default DayOffsViewer;