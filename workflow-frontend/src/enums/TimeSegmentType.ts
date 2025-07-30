export const TimeSegmentType = {
    Work: "Work",
    Break: "Break",
} as const;

export type TimeSegmentType = keyof typeof TimeSegmentType;
