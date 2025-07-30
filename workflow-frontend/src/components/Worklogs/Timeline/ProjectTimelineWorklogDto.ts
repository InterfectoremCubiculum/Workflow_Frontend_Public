import type { UsersTimelineWorklogDto } from "./UsersTimelineWorklogDto";

export interface ProjectTimelineWorklogDto {
    id: number;
    name: string;
    timeLines: UsersTimelineWorklogDto[];
}