import axiosInstance from "../../axiosConfig";
import type { SendedNotificationDto } from "../notifications/SendedNotificationDto";

export const getNotifications = async (read: boolean): Promise<SendedNotificationDto[]> => {
    const response = await axiosInstance.get<SendedNotificationDto[]>(`/notification`, {
        params: { read }
    });
    return response.data;
};

export const markNotificationAsRead = async (notificationsIds: number[]): Promise<void> => {
    await axiosInstance.patch(`/notification/markAsRead`, notificationsIds);
}
    
