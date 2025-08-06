import axiosInstance from "../../axiosConfig";
import type { WorkSummaryQueriesParameters } from "../components/Summary/User/UserWorkSummaryQueriesParameters";
import type { ProjectsWorkSummaryQueriesParameters } from "../components/Summary/Project/ProjectsWorkSummaryQueriesParameters";
import type { TeamsWorkSummaryQueriesParameters } from "../components/Summary/Team/TeamsWorkSummaryQueriesParameters";
import type { UserWorkSummaryDto } from "../components/Summary/UserWorkSummaryDto";
import type { UserWorkSummaryDayByDayDto } from "../components/Summary/UserWorkSummaryDayByDayDto";

export const getWorkSummary = async (params: WorkSummaryQueriesParameters): Promise<UserWorkSummaryDto[] | UserWorkSummaryDayByDayDto[]> => {
    try {
        
        const formattedParams = {
            periodStart: params.periodStart.toISOString().split('T')[0],
            periodEnd: params.periodEnd.toISOString().split('T')[0],
            userIds: params.userIds,
            isDayByDay: params.isDayByDay,
        };

        const response = await axiosInstance.post<UserWorkSummaryDto[] | UserWorkSummaryDayByDayDto[]>("/summary", formattedParams);
        return response.data;
    } catch (error) {
        handleError('Get Work Summary', error);
        throw error;
    }
}

export const getTeamsWorkSummary = async (params: TeamsWorkSummaryQueriesParameters): Promise<UserWorkSummaryDto[] | UserWorkSummaryDayByDayDto[]> => {
    try {
        const formattedParams = {
            periodStart: params.periodStart.toISOString().split('T')[0],
            periodEnd: params.periodEnd.toISOString().split('T')[0],
            teamIds: params.teamIds,
            isDayByDay: params.isDayByDay,
        };

        const response = await axiosInstance.post<UserWorkSummaryDto[] | UserWorkSummaryDayByDayDto[]>("/summary/team", formattedParams);
        return response.data;
    } catch (error) {
        handleError('Get Teams Work Summary', error);
        throw error;
    }
}

export const getProjectsWorkSummary = async (params: ProjectsWorkSummaryQueriesParameters): Promise<UserWorkSummaryDto[] | UserWorkSummaryDayByDayDto[]> => {
    try {
        const formattedParams = {
            periodStart: params.periodStart.toISOString().split('T')[0],
            periodEnd: params.periodEnd.toISOString().split('T')[0],
            projectIds: params.projectIds,
            isDayByDay: params.isDayByDay,
        };

        const response = await axiosInstance.post<UserWorkSummaryDto[] | UserWorkSummaryDayByDayDto[]>("/summary/project", formattedParams);
        return response.data;
    } catch (error) {
        handleError('Get Projects Work Summary', error);
        throw error;
    }
}

export const getCSVWorkSummary = async (params: WorkSummaryQueriesParameters): Promise<{ url: string; filename: string }> => {
    try {
        const formattedParams = {
            periodStart: params.periodStart.toISOString().split('T')[0],
            periodEnd: params.periodEnd.toISOString().split('T')[0],
            userIds: params.userIds,
            isDayByDay: params.isDayByDay,
        };
        const response = await axiosInstance.post<Blob>(
            "/summary/export/",
            formattedParams,
            { responseType: 'blob' }
        );
        
        const contentDisposition = response.headers["content-disposition"];
        let filename = "work_summary.csv"; // fallback

        if (contentDisposition) {
            const match = contentDisposition.match(/filename="?(.+?)"?$/i);
            if (match?.[1]) {
                filename = decodeURIComponent(match[1]);
            }
        }
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        return { url, filename };

    } catch (error) {
        handleError('Get CSV Work Summary', error);
        throw error;
    }
}

function handleError(method: string, error: any) {
	console.error(`Error in summaryService.${method}: ${error}`);
}