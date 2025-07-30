export const ListOfSettingsKey = {
    daily_work_thread: "daily_work_thread",
    work_log_notification_end: "work_log_notification_end",
    work_log_notification_start: "work_log_notification_start",
    user_sync_day_of_month: "user_sync_day_of_month",
    user_sync_time_of_day: "user_sync_time_of_day",
    user_sync_enabled: "user_sync_enabled",
    user_sync_days_of_week: "user_sync_days_of_week",
    user_sync_frequency: "user_sync_frequency",
} as const;

export type ListOfSettingsKey = keyof typeof ListOfSettingsKey;
