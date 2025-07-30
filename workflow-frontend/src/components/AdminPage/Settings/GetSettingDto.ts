import type { SettingsType } from "../../../enums/SettingsType";

export interface GetSettingDto {
    key: string;
    value: string;
    type: SettingsType;
    description: string;
    isEditable: boolean;
}