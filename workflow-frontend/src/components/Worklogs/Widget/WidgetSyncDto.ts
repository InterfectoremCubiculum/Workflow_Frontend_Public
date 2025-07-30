import type { TimeSegmentType } from "../../../enums/TimeSegmentType";

export interface WidgetSyncDto {
    timeSegmentType: TimeSegmentType;
    startTime: Date;
    durationInSeconds: number; 
}
