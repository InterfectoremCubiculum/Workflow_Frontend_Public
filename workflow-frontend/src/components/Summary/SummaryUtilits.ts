import { type ColumnHelper} from "@tanstack/react-table";
import { getCSVWorkSummary } from "../../services/summaryService";
import type { WorkSummaryQueriesParameters } from "./User/UserWorkSummaryQueriesParameters";
import type { UserWorkSummaryDayByDayDto } from "./UserWorkSummaryDayByDayDto";
import type { UserWorkSummaryDto } from "./UserWorkSummaryDto";

export const downloadCSV = async (csvParams: WorkSummaryQueriesParameters) => {
    try {
        const { url, filename } = await getCSVWorkSummary(csvParams);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
        alert("Failed to download CSV file. Please try again later.");
    }
}

export const dayByDayColumnsMaker =  (columnHelperDay :  ColumnHelper<UserWorkSummaryDayByDayDto>) => {
    return [
        columnHelperDay.accessor(row => `${row.name} ${row.surname}`, {
          id: 'userInfo',
          header: 'User',
        }),
        columnHelperDay.accessor('date', { header: 'Date' }),
        columnHelperDay.accessor('projectName', { header: 'Project' }),
        columnHelperDay.accessor('teamName', { header: 'Team' }),
        columnHelperDay.accessor('workMinutes', {
          header: 'Work',
          cell: info => `${info.getValue()} min`,
        }),
        columnHelperDay.accessor('breakMinutes', {
          header: 'Break',
          cell: info => `${info.getValue()} min`,
        }),
      ];
}

export const summaryColumnsMaker = (columnHelperSummary: ColumnHelper<UserWorkSummaryDto>) => {
    return [
        columnHelperSummary.accessor(row => `${row.name} ${row.surname}`, {
        id: 'userInfo',
        header: 'User',
        }),
        columnHelperSummary.accessor('projectName', { header: 'Project' }),
        columnHelperSummary.accessor('teamName', { header: 'Team' }),
        columnHelperSummary.accessor('totalWorkHours', {
        header: 'Sum work hours',
        cell: info => `${info.getValue()} d.h:m:s`,
        }),
        columnHelperSummary.accessor('totalBreakHours', {
        header: 'Sum break hours',
        cell: info => `${info.getValue()} d.h:m:s`,
        }),
        columnHelperSummary.accessor('totalDaysWorked', { header: 'Days worked' }),
        columnHelperSummary.accessor('totalDaysOff', { header: 'Days off' }),
    ]
}