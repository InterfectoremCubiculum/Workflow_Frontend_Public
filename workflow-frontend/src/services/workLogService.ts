import axiosInstance from "../../axiosConfig";
import type { UsersTimelineWorklogDto } from "../components/Worklogs/Timeline/UsersTimelineWorklogDto";
import type { GetTimeSegmentDto } from "../components/Worklogs/GetTimeSegmentDto";
import type { ProjectTimelineWorklogDto } from "../components/Worklogs/Timeline/ProjectTimelineWorklogDto";
import type { TeamTimelineWorklogDto } from "../components/Worklogs/Timeline/TeamTimelineWorklogDto";
import type { GroupTimelineWorklogQueryParameters } from "../components/Worklogs/Timeline/GroupTimelineWorklogQueryParameters";
import type { UserTimelineWorklogQueryParameters } from "../components/Worklogs/Timeline/UserTimelineWorklogQueryParameters";
import type { WidgetSyncDto } from "../components/Worklogs/Widget/WidgetSyncDto";

export const StartWork = async (): Promise<void> => {
    try {
        await axiosInstance.post('/worklog/startWork');
    } catch (error: any) {
        handleError('StartWork', error);
        throw error;
    }
}
export const EndWork = async (): Promise<void> => {
    try {
        await axiosInstance.post('/worklog/endWork');
    } catch (error: any) {
        handleError('StartWork', error);
        throw error;
    }
}
export const StartBreak = async (): Promise<void> => {
    try {
        await axiosInstance.post('/worklog/startBreak');
    } catch (error: any) {
        handleError('StartWork', error);
        throw error;
    }
}
export const ResumeWork = async (): Promise<void> => {
    try {
        await axiosInstance.post('/worklog/resumeWork');
    } catch (error: any) {
        handleError('StartWork', error);
        throw error;
    }
}

export const getTimeLine = async (visibleTimeStart: Date, visibleTimeEnd: Date): Promise<GetTimeSegmentDto[]> => {
    try {
        const response = await axiosInstance.get<GetTimeSegmentDto[]>('/worklog/byUser',{
            params: {
                startTime: visibleTimeStart.toISOString(),
                endTime: visibleTimeEnd.toISOString()
            },
        });
        return response.data;
    } catch (error: any) {
        handleError('getWorkLog', error);
        throw error;
    }
}

export const UsersTimelineWorklog = async (params: UserTimelineWorklogQueryParameters): Promise<UsersTimelineWorklogDto[]> => {
    try {
        const response = await axiosInstance.post<UsersTimelineWorklogDto[]>('/worklog/userTimeline', params);
        return response.data;
    } catch (error: any) {
        handleError('Users Timeline Worklog', error);
        throw error;
    }
}

export const ProjectTimelineWorklog = async (params: GroupTimelineWorklogQueryParameters): Promise<TeamTimelineWorklogDto> => {
    try {
        const response = await axiosInstance.post<TeamTimelineWorklogDto>('/worklog/projectTimeLine', params);
        return response.data;
    } catch (error: any) {
        handleError('Project Timeline Worklog', error);
        throw error;
    }
}

export const TeamTimelineWorklog = async (params: GroupTimelineWorklogQueryParameters): Promise<ProjectTimelineWorklogDto> => {
    try {
        const response = await axiosInstance.post<ProjectTimelineWorklogDto>('/worklog/teamTimeLine', params);
        return response.data;
    } catch (error: any) {
        handleError('Team Timeline Worklog', error);
        throw error;
    }
}

export const WidgetSync = async (): Promise<WidgetSyncDto | null> => {
    try {
        const response = await axiosInstance.get<WidgetSyncDto | null>('/worklog/widgetSync');
        return response.data;
    } catch (error: any) {
        handleError('Widget Sync', error);
        throw error;
    }
}

function handleError(method: string, error: any) {
	console.error(`Error in userService.${method}: ${error}`);
}