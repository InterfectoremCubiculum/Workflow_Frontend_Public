import { DateTime } from "luxon";

export const utcToLocalHHmm = (time: string): string => {
    return DateTime.fromFormat(time, "HH:mm", { zone: "utc" }).toLocal().toFormat("HH:mm");
};

export const localToUtcHHmm = (time: string): string => {
    return DateTime.fromFormat(time, "HH:mm", { zone: "local" }).toUTC().toFormat("HH:mm");
};
