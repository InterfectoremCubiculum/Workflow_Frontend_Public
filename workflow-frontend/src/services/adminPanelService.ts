import axiosInstance from "../../axiosConfig";
import type { GetSettingDto } from "../components/AdminPage/Settings/GetSettingDto";
import type { UpdatedSettingDto } from "../components/AdminPage/Settings/UpdatedSettingDto";

export const getAppSettings = async (): Promise<GetSettingDto[]> => {
    try {
        const response = await axiosInstance.get<GetSettingDto[]>(`/AdminPanel/Settings`);
        return response.data;        
    } catch (error: any) {
        handleError('getAppSettings', error);
        throw error;
    }
};

export const updateAppSettings = async (settings: UpdatedSettingDto[]): Promise<void> => {
    try {
        const response = await axiosInstance.post(`/AdminPanel/Settings`, settings);
        return response.data;
    } catch (error: any) {
        handleError('updateAppSettings', error);
        throw error;
    }
};
export const updateSettings_UserSync = async (settings: UpdatedSettingDto[]): Promise<void> => {
    try {
        const response = await axiosInstance.post(`/AdminPanel/Settings/UserSync`, settings);
        return response.data;
    } catch (error: any) {
        handleError('updateSettings_UserSync', error);
        throw error;
    }
};

function handleError(method: string, error: any) {
	console.error(`Error in admin Panel Service.${method}: ${error}`);
}