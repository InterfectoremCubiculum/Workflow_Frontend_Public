import Timeline from "react-calendar-timeline";
import moment from "moment";
import type { GetTimeSegmentDto } from "../GetTimeSegmentDto";
import { useEffect, useRef, useState } from "react";
import { getTimeLine } from "../../../services/workLogService";
import { TimeSegmentType } from "../../../enums/TimeSegmentType";
import TimeLineLegend from "./TimeLineLegend";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const WorkLogViewer: React.FC = () => {
    const [workLog, setWorklog] = useState<GetTimeSegmentDto[]>([]);
    const [visibleTimeStart, setVisibleTimeStart] = useState(moment().startOf('day').valueOf());
    const [visibleTimeEnd, setVisibleTimeEnd] = useState(moment().endOf('day').valueOf());
    const [loadedMonths, setLoadedMonths] = useState<Set<string>>(new Set());

    const groups = [
        { id: 1, title: 'Work Timeline' }
    ];

    const cachedWorkLogs = useRef<Map<string, GetTimeSegmentDto[]>>(new Map());

    const items = workLog.map((segment, index) => {
        const start = moment.utc(segment.startTime).local();
        const end = segment.endTime
            ? moment.utc(segment.endTime).local()
            : (segment.durationInSeconds
                ? moment.utc(segment.startTime).local().add(segment.durationInSeconds, 'seconds')
                : moment()
            );

        const isOngoing = segment.endTime === null;
        let backgroundColor = 'lightgreen';
        if (segment.timeSegmentType === TimeSegmentType.Break) {
            backgroundColor = 'lightcoral';
        }
        if (isOngoing) {
            backgroundColor = '#ffd966';
        }

        const duration = moment.duration(end.diff(start));
        const durationString = `${Math.floor(duration.asHours())}h ${duration.minutes()}m ${duration.seconds()}s`;

        return {
            id: index,
            group: 1,
            title: segment.timeSegmentType === TimeSegmentType.Break ? 'Break' : 'Work',
            start_time: start,
            end_time: end,
            itemProps: {
                style: {
                    background: backgroundColor,
                },
            },
            originalSegment: segment,
            displayStartTime: start.format('HH:mm:ss'),
            displayEndTime: end.format('HH:mm:ss'),
            displayDuration: durationString,
            fullStartDate: start.format('YYYY-MM-DD HH:mm:ss'),
            fullEndDate: end.format('YYYY-MM-DD HH:mm:ss')
        };
    });

    useEffect(() => {
        fetchWorklogsForRange();
    }, [visibleTimeStart, visibleTimeEnd]);

    const fetchWorklogsForRange = async () => {
        const start = moment(visibleTimeStart).startOf('month');
        const end = moment(visibleTimeEnd).endOf('month');

        const monthsToLoad: string[] = [];
        const newLoadedMonths = new Set(loadedMonths);

        let current = start.clone();
        while (current.isSameOrBefore(end, 'month')) {
            const monthStr = current.format("YYYY-MM");
            if (!newLoadedMonths.has(monthStr)) {
                monthsToLoad.push(monthStr);
                newLoadedMonths.add(monthStr);
            }
            current.add(1, 'month');
        }

        if (monthsToLoad.length === 0) {
            return;
        }

        setLoadedMonths(newLoadedMonths);

        const fetches = monthsToLoad.map(async (month) => {
            const startOfMonth = moment(month + "-01").startOf('month').toDate();
            const endOfMonth = moment(month + "-01").endOf('month').toDate();
            const response = await getTimeLine(startOfMonth, endOfMonth);
            return { month, data: response };
        });

        const results = await Promise.all(fetches);

        results.forEach(({ month, data }) => {
            cachedWorkLogs.current.set(month, data);
        });

        const mergedData = Array.from(cachedWorkLogs.current.values()).flat();
        setWorklog(mergedData);
    };

    const itemRenderer = ({ item, itemContext, getItemProps }: any) => {
        const tooltipContent = (
            <Tooltip id={`tooltip-${item.id}`}>
                <div>Type: {item.title}</div>
                <div>From: {item.fullStartDate}</div>
                <div>To: {item.fullEndDate}</div>
                <div>Duration: {item.displayDuration}</div>
            </Tooltip>
        );

        const itemProps = getItemProps({
            style: {
                background: item.itemProps.style.background,
                color: 'black',
                border: '1px solid ' + item.itemProps.style.background,
                borderRadius: '4px',
                textAlign: 'center',
                fontSize: '0.85em',
                padding: '2px 5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: itemContext.dimensions.height,
            },
        });

        const { key, ...restProps } = itemProps;

        return (
            <OverlayTrigger
                placement="top"
                overlay={tooltipContent}
                delay={{ show: 250, hide: 100 }}
            >
                <div key={key} {...restProps}>
                    <div style={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        width: '100%',
                    }}>
                        {itemContext.title}
                    </div>
                </div>
            </OverlayTrigger>
        );
    };


    return (
        <div>
            <h1>Work Log Viewer</h1>
            <Timeline
                groups={groups}
                items={items ?? []}
                visibleTimeStart={visibleTimeStart}
                visibleTimeEnd={visibleTimeEnd}
                defaultTimeStart={moment.utc().add(-12, 'hour').local().valueOf()}
                defaultTimeEnd={moment.utc().add(12, 'hour').local().valueOf()}
                onTimeChange={(start, end) => {
                    setVisibleTimeStart(start);
                    setVisibleTimeEnd(end);
                }}
                canMove={false}
                canResize={false}
                canSelect={false}
                itemRenderer={itemRenderer}
            />
            <div className="mt-3 d-flex justify-content-center">
                <TimeLineLegend />
            </div>
        </div>
    );
}
export default WorkLogViewer;