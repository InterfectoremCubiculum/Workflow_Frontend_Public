import type { TimeSegmentType } from "../../../enums/TimeSegmentType";

export interface UsersTimelineWorklogDto {
    id: number;
    timeSegmentType: TimeSegmentType;
    startTime: Date;
    endTime: Date | null;
    durationInSeconds: number | null;
    userId: string;
    requestAction: boolean;
    createdAt: Date;
}