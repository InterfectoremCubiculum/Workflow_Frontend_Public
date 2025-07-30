import axiosInstance from "../../axiosConfig";
import type { GetSearchedTeamDto } from "../components/Searchings/TeamSearching/GetSearchedTeamDto";
import type { TeamSearchQueryParameters } from "../components/Searchings/TeamSearching/TeamSearchQueryParameters";
import type { UsersInTeamDto } from "../components/Users/UsersInTeamDto";

export const searchTeams = async (parameters: TeamSearchQueryParameters): Promise<GetSearchedTeamDto[]> => {
	try {
		const response = await axiosInstance.get<GetSearchedTeamDto[]>('/team/search', {
			params: parameters
		});
		return response.data;
	} catch (error: any) {
		handleError('search teams', error);
		throw error;
	}
}
export const getUsersInTeam = async (teamId: number): Promise<UsersInTeamDto[]> => {
	try {
		const response = await axiosInstance.get<UsersInTeamDto[]>(`/team/${teamId}/users`);
		return response.data;
	} catch (error: any) {
		handleError('getUsersInProject', error);
		throw error;
	}
}

function handleError(method: string, error: any) {
	console.error(`Error in team Service.${method}: ${error}`);
}