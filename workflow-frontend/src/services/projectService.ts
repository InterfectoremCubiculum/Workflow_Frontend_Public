import axiosInstance from "../../axiosConfig";
import type { GetSearchedProjectDto } from "../components/Searchings/ProjectSearching/GetSearchedProjectDto";
import type { ProjectSearchQueryParameters } from "../components/Searchings/ProjectSearching/ProjectSearchQueryParameters";
import type { UsersInProjectDto } from "../components/Users/UsersInProjectDto";

export const searchProjects = async (parameters: ProjectSearchQueryParameters): Promise<GetSearchedProjectDto[]> => {
	try {
		const response = await axiosInstance.get<GetSearchedProjectDto[]>('/project/search', {
			params: parameters
		});
		return response.data;
	} catch (error: any) {
		handleError('searchProjects', error);
		throw error;
	}
}
export const getUsersInProject = async (projectId: number): Promise<UsersInProjectDto> => {
	try {
		const response = await axiosInstance.get<UsersInProjectDto>(`/project/${projectId}/users`);
		return response.data;
	} catch (error: any) {
		handleError('getUsersInProject', error);
		throw error;
	}
}
function handleError(method: string, error: any) {
	console.error(`Error in project Service.${method}: ${error}`);
}