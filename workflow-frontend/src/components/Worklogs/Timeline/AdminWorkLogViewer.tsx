import { useEffect, useState } from "react";
import { ProjectTimelineWorklog, TeamTimelineWorklog, UsersTimelineWorklog } from "../../../services/workLogService";
import UserManySelecting from "../../Searchings/UserSearching/UserManySelecting";
import Timeline from "react-calendar-timeline";
import moment from "moment";
import { TimeSegmentType } from "../../../enums/TimeSegmentType";
import type { GetSearchedUserDto } from "../../Searchings/UserSearching/GetSearchedUserDto";
import type { GetSearchedProjectDto } from "../../Searchings/ProjectSearching/GetSearchedProjectDto";
import type { GetSearchedTeamDto } from "../../Searchings/TeamSearching/GetSearchedTeamDto";
import type { UsersTimelineWorklogDto } from "./UsersTimelineWorklogDto";
import type { UserTimelineWorklogQueryParameters } from "./UserTimelineWorklogQueryParameters";
import type { GroupTimelineWorklogQueryParameters } from "./GroupTimelineWorklogQueryParameters";
import ProjectSelecting from "../../Searchings/ProjectSearching/ProjectSelecting";
import TeamSelecting from "../../Searchings/TeamSearching/TeamSelecting";
import type { ProjectTimelineWorklogDto } from "./ProjectTimelineWorklogDto";
import type { TeamTimelineWorklogDto } from "./TeamTimelineWorklogDto";
import { getUsersByGuids } from "../../../services/userService";
import { getUsersInProject } from "../../../services/projectService";
import { getUsersInTeam } from "../../../services/teamService";
import TimeLineLegend from "./TimeLineLegend";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

type FilterType = "user" | "team" | "project";

const AdminWorkLogViewer: React.FC = () => {
    const [workLogs, setWorkLogs] = useState<UsersTimelineWorklogDto[]>([]);
    const [projectLog, setProjectLogs] = useState<ProjectTimelineWorklogDto>();
    const [teamLog, setTeamLogs] = useState<TeamTimelineWorklogDto>();

    const [visibleTimeStart, setVisibleTimeStart] = useState(moment().startOf('day').valueOf());
    const [visibleTimeEnd, setVisibleTimeEnd] = useState(moment().endOf('day').valueOf());
    const [selectedFilter, setSelectedFilter] = useState<FilterType>("user");
    
    const [selectedUsers, setSelectedUsers] = useState<GetSearchedUserDto[]>([]);
    const [usersInfo, setUsersInfo] = useState<GetSearchedUserDto[]>([]);

    const [paramsGuid, setParamsGuid] = useState<UserTimelineWorklogQueryParameters>({
        dateFrom: moment().startOf('month').format("YYYY-MM-DD"),
        dateTo: moment().endOf('month').format("YYYY-MM-DD"),
        userIds: [],
    });

    const [paramsNumber, setParamsNumber] = useState<GroupTimelineWorklogQueryParameters>({
        dateFrom: moment().startOf('month').format("YYYY-MM-DD"),
        dateTo: moment().endOf('month').format("YYYY-MM-DD"),
        groupId: 0,
    });

    const [loadedMonths, setLoadedMonths] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (
            (selectedFilter === "user" && paramsGuid.userIds.length > 0) 
            ||((selectedFilter === "project" 
            || selectedFilter === "team") 
            && paramsNumber.groupId)) 
        {
            fetchWorkLogs();
        }
    }, [paramsGuid, paramsNumber]);

    useEffect(() => {
        setWorkLogs([]);
        setProjectLogs(undefined);
        setTeamLogs(undefined);
        setUsersInfo([]);
    }, [selectedFilter]);
    
    const fetchWorkLogs = async () => {
        if (selectedFilter === "user") {
            await UsersTimelineWorklog(paramsGuid).then((response) => {
                setWorkLogs(response);
                setUsersInfo(selectedUsers);
            })
        }
        else if (selectedFilter === "team") {
            await TeamTimelineWorklog(paramsNumber).then((response) => {
                setTeamLogs(response);
                const userIds = response?.timeLines?.map(user => user.userId) ?? [];
                if (userIds.length === 0) {
                    alert("No users assigned to this team.");
                }
                fetchUsersInfo(response?.timeLines?.map(user => user.userId));
            })
        }
        else if (selectedFilter === "project") {
            await ProjectTimelineWorklog(paramsNumber).then((response) => {
                setProjectLogs(response);
                 const userIds = response?.timeLines?.map(user => user.userId) ?? [];
                if (userIds.length === 0) {
                    alert("No users assigned to this project.");
                }
                fetchUsersInfo(response?.timeLines?.map(user => user.userId));
            }) 
        }
    }

    const fetchUsersInfo = async (usersGuids: string[]) => {
        var users: any = [];
        
        if (selectedFilter === "project"){
            users = await getUsersInProject(paramsNumber.groupId);
        }
        else if (selectedFilter === "team") {
            users = await getUsersInTeam(paramsNumber.groupId);
        }
        else if (selectedFilter === "user") {
            users = await getUsersByGuids(usersGuids)
        }
        setUsersInfo(users);
    }
    const handleUserSelect = async (users: GetSearchedUserDto[]) => {
        setSelectedUsers(users);
        setParamsGuid((prevParams) => ({
            ...prevParams,
            userIds: users.map(user => user.userId),
        }));
    }

    const handleProjectSelect = async (project: GetSearchedProjectDto) => {
        setParamsNumber((prevParams) => ({
            ...prevParams,
            groupId: project.id,
        }));
    }

    const handleTeamSelect = async (team: GetSearchedTeamDto) => {
        setParamsNumber((prevParams) => ({
            ...prevParams,
            groupId: team.id,
        }));
    }

    const userGuidToGroupIdMap = new Map<string, number>();
        usersInfo.forEach((user, index) => {
        userGuidToGroupIdMap.set(user.userId, index + 1);
    });

    const groups = usersInfo.map((user, index) => ({
        id: index + 1,
        title: `${user.name} ${user.surname} (${user.email})`
    }));

    useEffect(() => {
        const start = moment(visibleTimeStart).startOf("month");
        const end = moment(visibleTimeEnd).endOf("month");

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

        if (monthsToLoad.length === 0) return;
        setLoadedMonths(newLoadedMonths);

        const monthStart = start.format("YYYY-MM-DD");
        const monthEnd = end.format("YYYY-MM-DD");

        if (selectedFilter === "user") {
            setParamsGuid(prev => ({
                ...prev,
                dateFrom: monthStart,
                dateTo: monthEnd,
            }));
        } else {
            setParamsNumber(prev => ({
                ...prev,
                dateFrom: monthStart,
                dateTo: monthEnd,
            }));
        }
    }, [visibleTimeStart, visibleTimeEnd]);




    const allWorkLogs = selectedFilter === "user"
        ? workLogs
        : selectedFilter === "project"
            ? projectLog?.timeLines ?? []
            : teamLog?.timeLines ?? [];

     const items = allWorkLogs.map((segment, index) => {
        const isOngoing = !segment.endTime;
        const start = moment.utc(segment.startTime).local();
        const end = segment.endTime
            ? moment.utc(segment.endTime).local()
            : (segment.durationInSeconds
                ? moment.utc(segment.startTime).local().add(segment.durationInSeconds, 'seconds')
                : moment()
            );

        const groupId = userGuidToGroupIdMap.get(segment.userId) ?? 1;

        let backgroundColor = 'lightgreen';
        if (segment.timeSegmentType === TimeSegmentType.Break) {
            backgroundColor = 'lightcoral';
        }
        if (isOngoing) {
            backgroundColor = '#ffd966';
        }

        // Obliczanie czasu trwania
        const duration = moment.duration(end.diff(start));
        const durationString = `${Math.floor(duration.asHours())}h ${duration.minutes()}m ${duration.seconds()}s`;

        return {
            id: `${segment.userId}-${index}`, // Unikalne ID, bo index może być ten sam dla różnych użytkowników
            group: groupId,
            title: segment.timeSegmentType === TimeSegmentType.Break ? 'Break' : 'Work',
            start_time: start,
            end_time: end,
            itemProps: {
                style: {
                    background: backgroundColor,
                },
            },
            // 🚀 DODATKOWE DANE DLA TOOLTIPA
            originalSegment: segment,
            displayStartTime: start.format('HH:mm:ss'),
            displayEndTime: end.format('HH:mm:ss'),
            displayDuration: durationString,
            fullStartDate: start.format('YYYY-MM-DD HH:mm:ss'),
            fullEndDate: end.format('YYYY-MM-DD HH:mm:ss')
        };
    });

    const itemRenderer = ({ item, itemContext, getItemProps }: any) => {
        const tooltipContent = (
            <Tooltip id={`tooltip-${item.id}`}>
                <div>Type: {item.title}</div>
                <div>From: {item.fullStartDate}</div>
                <div>To: {item.fullEndDate}</div>
                <div>Duration: {item.displayDuration}</div>
            </Tooltip>
        );

        return (
            <OverlayTrigger
                placement="top"
                overlay={tooltipContent}
                delay={{ show: 250, hide: 100 }}
            >
                <div
                    {...getItemProps({
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
                    })}
                >
                    <div style={{
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        width: '100%'
                    }}>
                        {itemContext.title}
                    </div>
                </div>
            </OverlayTrigger>
        );
    };
    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as FilterType;
        setSelectedFilter(value);
        setSelectedUsers([]);
        setLoadedMonths(new Set());
        setParamsGuid({
            dateFrom: moment().startOf('month').format("YYYY-MM-DD"),
            dateTo: moment().endOf('month').format("YYYY-MM-DD"),
            userIds: [],
        });

        setParamsNumber({
            dateFrom: moment().startOf('month').format("YYYY-MM-DD"),
            dateTo: moment().endOf('month').format("YYYY-MM-DD"),
            groupId: 0,
        });
    }
    return (
    <>
        <div className="mt-3">
            <label>Filtr by:</label>
            <select 
                value={selectedFilter}
                onChange={(e) => handleChange(e)}
                className="form-select"
            >
                <option value="user">User</option>
                <option value="project">Project</option>
                <option value="team">Team</option>
            </select>
        </div>

        <div className="mt-3">
            {selectedFilter === "user" && (
                <UserManySelecting onUserSelect={handleUserSelect} />
            )}
            {selectedFilter === "project" && (
                <ProjectSelecting onProjectSelect={handleProjectSelect} />
            )}
            {selectedFilter === "team" && (
                <TeamSelecting onTeamSelect={handleTeamSelect} />
            )}
        </div>

        <div className="mt-3">
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
        </div>
        <div className="mt-3 d-flex justify-content-center">
            <TimeLineLegend />
        </div>
    </>
)
}
export default AdminWorkLogViewer;
