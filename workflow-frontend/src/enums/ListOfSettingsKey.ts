export const ListOfSettingsKey = {
    daily_work_thread: "daily_work_thread",
    work_log_notification_end: "work_log_notification_end",
    work_log_notification_start: "work_log_notification_start",
    user_sync_day_of_month: "user_sync_day_of_month",
    user_sync_time_of_day: "user_sync_time_of_day",
    user_sync_enabled: "user_sync_enabled",
    user_sync_days_of_week: "user_sync_days_of_week",
    user_sync_frequency: "user_sync_frequency",
    max_work_time: "max_work_time",
    max_time_break: "max_time_break",
    max_time_away: "max_time_away",
    max_summarise_break_time: "max_summarise_break_time",   
    time_away_when_user_get_notification: "time_away_when_user_get_notification",
    max_reverse_registration_time_logged: "max_reverse_registration_time_logged",
    max_reverse_registration_time: "max_reverse_registration_time",
} as const;

export type ListOfSettingsKey = keyof typeof ListOfSettingsKey;
