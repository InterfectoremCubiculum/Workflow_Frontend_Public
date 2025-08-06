import { useState, useMemo } from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/react-table';
import UserManySelecting from "../../Searchings/UserSearching/UserManySelecting";
import type { GetSearchedUserDto } from "../../Searchings/UserSearching/GetSearchedUserDto";
import { getWorkSummary } from "../../../services/summaryService";
import type { WorkSummaryQueriesParameters } from "./UserWorkSummaryQueriesParameters";
import { Button, Form } from "react-bootstrap";
import moment from "moment";
import type { UserWorkSummaryDto } from "../UserWorkSummaryDto";
import type { UserWorkSummaryDayByDayDto } from "../UserWorkSummaryDayByDayDto";
import { dayByDayColumnsMaker, downloadCSV, summaryColumnsMaker } from "../SummaryUtilits";
import { RenderTable } from "../RenderTable";

const UserSummaryComponent: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<GetSearchedUserDto[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [fetchedData, setFetchedData] = useState<UserWorkSummaryDto[] | UserWorkSummaryDayByDayDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<string>(moment().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState<string>(moment().endOf('day').format('YYYY-MM-DD'));
  const [isDayByDay, setIsDayByDay] = useState(true);
  const [fetchedByDayDayStatus, setFetchedByDayDayStatus] = useState<boolean>(true);

  const fetchUserSummary = async () => {
    setIsLoading(true);
    try {
      const params = handleSetParams();
      setFetchedByDayDayStatus(params.isDayByDay);
      const data = await getWorkSummary(params);
      setFetchedData(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetParams = ()  => {
    const params: WorkSummaryQueriesParameters = {
      periodStart: new Date(startDate),
      periodEnd: new Date(endDate),
      userIds: selectedUser.map(user => user.userId),
      isDayByDay: isDayByDay,
    };
    return params;
  }
  const handleFindClick = () => {
    fetchUserSummary();
  };

  const handleDownload = async () => {
    const params = handleSetParams();
    await downloadCSV(params);
  };

  const columnHelperDay = createColumnHelper<UserWorkSummaryDayByDayDto>();
  const columnHelperSummary = createColumnHelper<UserWorkSummaryDto>();
  const dayByDayColumns = useMemo(() => dayByDayColumnsMaker(columnHelperDay), [columnHelperDay]);
  const summaryColumns = useMemo(() => summaryColumnsMaker(columnHelperSummary), [columnHelperSummary]);

  const dayByDayTable = useReactTable<UserWorkSummaryDayByDayDto>({
    data: fetchedByDayDayStatus ? fetchedData as UserWorkSummaryDayByDayDto[] : [],
    columns: dayByDayColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const summaryTable = useReactTable<UserWorkSummaryDto>({
    data: !fetchedByDayDayStatus ? fetchedData as UserWorkSummaryDto[] : [],
    columns: summaryColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      <div style={{ width: '80vw' }}>
        <UserManySelecting onUserSelect={setSelectedUser} />
        <div className="d-flex mb-3 align-items-end flex-wrap mt-3">
          <div className="me-2">
            <label className="form-label">Start date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div className="ms-2 me-3">
            <label className="form-label">End date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
          <Form.Check
            type="switch"
            label="Day by Day"
            checked={isDayByDay}
            onChange={e => setIsDayByDay(e.target.checked)}
          />
          <div className="ms-auto">
            <Button onClick={handleDownload}>Download CSV</Button>
            <Button className="ms-2" onClick={handleFindClick}>Find</Button>
          </div>
        </div>
      </div>
      <div style={{ width: '80vw' }}>
        {fetchedData.length > 0 && !isLoading ? (
          <>
            {fetchedByDayDayStatus ? <RenderTable table={dayByDayTable} /> : <RenderTable table={summaryTable} />}
          </>
        ) : (
          <p className="mt-3 text-warning">Click Find button to load data</p>
        )}
      </div>
    </div>
  );
};


export default UserSummaryComponent;