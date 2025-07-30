import axiosInstance from "../../axiosConfig";
import type { WorkSummaryQueriesParameters } from "../components/Summary/User/UserWorkSummaryQueriesParameters";
import type { ProjectsWorkSummaryQueriesParameters } from "../components/Summary/Project/ProjectsWorkSummaryQueriesParameters";
import type { TeamsWorkSummaryQueriesParameters } from "../components/Summary/Team/TeamsWorkSummaryQueriesParameters";
import type { UserWorkSummaryDto } from "../components/Summary/UserWorkSummaryDto";

export const getWorkSummary = async (params: WorkSummaryQueriesParameters): Promise<{summary: UserWorkSummaryDto[], token: string}> => {
    try {
        
        const formattedParams = {
            periodStart: params.periodStart.toISOString().split('T')[0],
            periodEnd: params.periodEnd.toISOString().split('T')[0],
            userIds: params.userIds,
        };

        const response = await axiosInstance.post<{summary: UserWorkSummaryDto[], token: string}>("/summary", formattedParams);
        return response.data;
    } catch (error) {
        handleError('Get Work Summary', error);
        throw error;
    }
}

export const getTeamsWorkSummary = async (params: TeamsWorkSummaryQueriesParameters): Promise<{summary: UserWorkSummaryDto[], token: string}> => {
    try {
        const formattedParams = {
            periodStart: params.periodStart.toISOString().split('T')[0],
            periodEnd: params.periodEnd.toISOString().split('T')[0],
            teamIds: params.teamIds,
        };

        const response = await axiosInstance.post<{summary: UserWorkSummaryDto[], token: string}>("/summary/team", formattedParams);
        return response.data;
    } catch (error) {
        handleError('Get Teams Work Summary', error);
        throw error;
    }
}

export const getProjectsWorkSummary = async (params: ProjectsWorkSummaryQueriesParameters): Promise<{summary:UserWorkSummaryDto[], token: string}> => {
    try {
        const formattedParams = {
            periodStart: params.periodStart.toISOString().split('T')[0],
            periodEnd: params.periodEnd.toISOString().split('T')[0],
            projectIds: params.projectIds,
        };

        const response = await axiosInstance.post<{summary:UserWorkSummaryDto[], token: string}>("/summary/project", formattedParams);
        return response.data;
    } catch (error) {
        handleError('Get Projects Work Summary', error);
        throw error;
    }
}

export const getCSVWorkSummary = async (token: string): Promise<string> => {
    try {   
        const response = await axiosInstance.get(`/summary/export/${token}`, {
            responseType: 'blob',
        });

        const blob = new Blob([response.data], { type: 'text/csv' });
        return URL.createObjectURL(blob);
    } catch (error) {
        handleError('Get CSV Work Summary', error);
        throw error;
    }
}

function handleError(method: string, error: any) {
	console.error(`Error in summaryService.${method}: ${error}`);
}