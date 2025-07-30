export const SettingsType = {
    String: "String",
    Integer: "Integer",
    Decimal: "Decimal",
    Boolean: "Boolean",
    DateTime: "DateTime",
    TimeSpan: "TimeSpan",
} as const;

export type SettingsType = keyof typeof SettingsType;
