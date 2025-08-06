import { useState, useMemo } from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";
import {getProjectsWorkSummary } from "../../../services/summaryService";
import { Button, Form } from "react-bootstrap";
import type { UserWorkSummaryDto } from "../UserWorkSummaryDto";
import type { GetSearchedProjectDto } from "../../Searchings/ProjectSearching/GetSearchedProjectDto";
import type { ProjectsWorkSummaryQueriesParameters } from "./ProjectsWorkSummaryQueriesParameters";
import ProjectManySelecting from "../../Searchings/ProjectSearching/ProjectManySelecting";
import moment from "moment";
import type { WorkSummaryQueriesParameters } from "../User/UserWorkSummaryQueriesParameters";
import { dayByDayColumnsMaker, downloadCSV, summaryColumnsMaker } from "../SummaryUtilits";
import { RenderTable } from "../RenderTable";
import type { UserWorkSummaryDayByDayDto } from "../UserWorkSummaryDayByDayDto";

const ProjectSummaryComponent: React.FC = () => {
  const [selectedProjects, setSelectedProjects] = useState<GetSearchedProjectDto[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [fetchedData, setFetchedData] = useState<UserWorkSummaryDto[] | UserWorkSummaryDayByDayDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(moment().startOf("month").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().endOf("day").format("YYYY-MM-DD"));
  const [isDayByDay, setIsDayByDay] = useState(true);
  const [fetchedByDayDayStatus, setFetchedByDayDayStatus] = useState<boolean>(true);

  const fetchProjectSummary = async () => {
    const params = handleSetParams();
    setIsLoading(true);
    try {
      const data = await getProjectsWorkSummary(params);
      setFetchedByDayDayStatus(params.isDayByDay);
      setFetchedData(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindClick = () => {
    fetchProjectSummary();
  };

  const handleSetParams = ()  => {
    const params: ProjectsWorkSummaryQueriesParameters = {
      periodStart: new Date(startDate),
      periodEnd: new Date(endDate),
      projectIds: selectedProjects.map(project => project.id),
      isDayByDay: isDayByDay,
    };
    return params;
  }


  const handleDownload = async () => {
    const params = handleSetParams();
    const csvParams: WorkSummaryQueriesParameters = {
      periodStart: params?.periodStart ?? new Date(startDate),
      periodEnd: params?.periodEnd ?? new Date(endDate),
      userIds: fetchedData.map(user => user.userId),
      isDayByDay: params?.isDayByDay ?? isDayByDay,
    }
    await downloadCSV(csvParams);
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
        <ProjectManySelecting onProjectSelect={setSelectedProjects} />
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

export default ProjectSummaryComponent;