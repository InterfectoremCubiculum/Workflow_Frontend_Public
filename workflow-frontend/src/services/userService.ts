import axios from 'axios';
import axiosInstance from '../../axiosConfig';
import type { GetSearchedUserDto } from '../components/Searchings/UserSearching/GetSearchedUserDto';
import type { UserSearchQueryParameters } from '../components/Searchings/UserSearching/UserSearchQueryParameters';
import type { GetUsersByGuidDto } from '../components/Users/GetUsersByGuidDto';
import type { GetMeDto } from '../utility/GetMeDto';


export const userSync = async (): Promise<void>=> {
    try {
        await axiosInstance.get("/user/sync");
    } catch (error) {
		handleError('userSync', error);
        throw error;
    }
}

export const aboutMe = async (): Promise<GetMeDto | null> => {
    try {
        const response = await axiosInstance.get<{ isAuthenticated: boolean; getMeDto: GetMeDto }>('/Auth/user-info');
        if (response.data.isAuthenticated && response.data.getMeDto) {
            return response.data.getMeDto;
        } else {
            return null;
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            return null;
        }
        if (axios.isAxiosError(error)) {
            console.error('Error fetching user data in aboutMe:', error.response?.status, error.response?.data);
        } else {
            console.error('Error fetching user data in aboutMe:', error);
        }
        return null;
    }
};

export const searchUsers = async (parameters: UserSearchQueryParameters): Promise<GetSearchedUserDto[]> => {
	try {
		const response = await axiosInstance.get<GetSearchedUserDto[]>('/user/search', {
			params: parameters
		});
		return response.data;
	} catch (error: any) {
		handleError('search user', error);
		throw error;
	}
}

export const getUsersByGuids = async (userIds: string[]): Promise<GetUsersByGuidDto[]> => {
	try {
		const response = await axiosInstance.post<GetSearchedUserDto[]>('/user/getUsersByGuids', userIds);
		return response.data;
	} catch (error: any) {
		handleError('get user by guids', error);
		throw error;
	}
}
function handleError(method: string, error: any) {
	console.error(`Error in userService.${method}: ${error}`);
}