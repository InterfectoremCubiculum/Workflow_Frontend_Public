export const ResolveActionCommand = {
    Reject: "Reject",
    Approve: "Approve",
    SetStartTimeAsCreationDate: "SetStartTimeAsCreationDate",
} as const;

export type ResolveActionCommand = keyof typeof ResolveActionCommand;
