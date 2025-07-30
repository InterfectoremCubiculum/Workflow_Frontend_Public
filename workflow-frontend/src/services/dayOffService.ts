import qs from "qs";
import axiosInstance from "../../axiosConfig";
import type { DayOffsRequestQueryParameters } from "../components/AdminPage/AdminPanel/DayOffsRequestQueryParameters";
import type { GetDayOffRequestDto } from "../components/AdminPage/AdminPanel/GetDayOffRequestDto";
import type { PagedResponse } from "../utility/PagedResponse";
import type { CalendarDayOffsRequestQueryParameters } from "../components/DayOff/Calendar/CalendarDayOffsRequestQueryParameters";
import type { GetCalendarDayOffDto } from "../components/DayOff/Calendar/GetCalendarDayOffDto";
import type { UpdateDayOffRequestDto } from "../components/DayOff/UpdateDayOffRequestDto";


export const getDayOffRequests  = async (params: DayOffsRequestQueryParameters): Promise<PagedResponse<GetDayOffRequestDto>> => {
	try {
		const response = await axiosInstance.get<PagedResponse<GetDayOffRequestDto>>('/dayOffRequest',{
            params,
            paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
        });
		return response.data;
	} catch (error: any) {
		handleError('dayOffSumarise', error);
		throw error;
	}
};

export const changeDayOffRequestStatus = async (id: number, status: string): Promise<void> => {
    try {
        await axiosInstance.patch(`/dayOffRequest/${id}/${status}`);
    } catch (error: any) {
        handleError('changeDayOffRequestStatus', error);
        throw error;
    }
}

export const getDayOffsForCalendar = async (params: CalendarDayOffsRequestQueryParameters): Promise<GetCalendarDayOffDto[]> => {
    try {
        const response = await axiosInstance.get<GetDayOffRequestDto[]>(`/dayOffRequest/calendar`,{
            params,
            paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
        });
        return response.data;        
    } catch (error: any) {
        handleError('getDayOffsForCalendar', error);
        throw error;
    }
}
export const createBreak = async (dayOffRequest: Omit<GetCalendarDayOffDto, 'id'>): Promise<GetCalendarDayOffDto> => {
    try {
        const response = await axiosInstance.post<GetCalendarDayOffDto>(`/dayOffRequest`, dayOffRequest);
        return response.data;
    } catch (error: any) {
        handleError('createDayOffRequest', error);
        throw error;
    }
}

export const deleteDayOffRequest = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/dayOffRequest/${id}`);
    } catch (error: any) {
        handleError('deleteDayOffRequest', error);
        throw error;
    }
}

export const updateDayOffRequestStatus = async (updateDayOffDto: UpdateDayOffRequestDto): Promise<void> => {
    try {
        await axiosInstance.put(`/dayOffRequest`,updateDayOffDto);
    } catch (error: any) {
        handleError('updateDayOffRequestStatus', error);
        throw error;
    }
}

function handleError(method: string, error: any) {
	console.error(`Error in userService.${method}: ${error}`);
}