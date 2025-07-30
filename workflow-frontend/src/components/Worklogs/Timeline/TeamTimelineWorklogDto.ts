import type { UsersTimelineWorklogDto } from "./UsersTimelineWorklogDto";

export interface TeamTimelineWorklogDto {
    id: number;
    name: string;
    timeLines: UsersTimelineWorklogDto[];
}