import type { TimeSegmentType } from "../../enums/TimeSegmentType";

export interface GetTimeSegmentDto {
    timeSegmentType: TimeSegmentType;
    startTime: Date;
    endTime: Date | null;
    durationInSeconds: number; 
}
