import { useState, useMemo } from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type SortingState,
} from "@tanstack/react-table";
import { getCSVWorkSummary, getProjectsWorkSummary } from "../../../services/summaryService";
import { Button } from "react-bootstrap";
import type { UserWorkSummaryDto } from "../UserWorkSummaryDto";
import type { GetSearchedProjectDto } from "../../Searchings/ProjectSearching/GetSearchedProjectDto";
import type { ProjectsWorkSummaryQueriesParameters } from "./ProjectsWorkSummaryQueriesParameters";
import ProjectManySelecting from "../../Searchings/ProjectSearching/ProjectManySelecting";
import moment from "moment";

const ProjectSummaryComponent: React.FC = () => {
  const [selectedProjects, setSelectedProjects] = useState<GetSearchedProjectDto[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<UserWorkSummaryDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(moment().startOf("year").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().endOf("year").format("YYYY-MM-DD"));
  const [message, setMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string>("");

  const fetchProjectSummary = async () => {
    if (selectedProjects.length === 0) {
      setMessage("Please select at least one project.");
      return;
    }

    const params: ProjectsWorkSummaryQueriesParameters = {
      periodStart: new Date(startDate),
      periodEnd: new Date(endDate),
      projectIds: selectedProjects.map(p => p.id),
    };

    setIsLoading(true);
    try {
      const res = await getProjectsWorkSummary(params);
      if (!res.summary || res.summary.length === 0) {
        setMessage("No users assigned to the selected projects.");
        setData([]);
        return;
      }

      setData(res.summary);
      setToken(res.token);
      setMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindClick = () => {
    if (selectedProjects.length > 0) {
      fetchProjectSummary();
    } else {
      alert("Please select at least one project.");
    }
  };

  const columnHelper = createColumnHelper<UserWorkSummaryDto>();
  const columns = useMemo(() => [
    columnHelper.accessor(row => `${row.name} ${row.surname}`, {
      id: 'user',
      header: 'User',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('projectName', {
      header: 'Project',
      cell: info => info.getValue() ?? '-',
    }),
    columnHelper.accessor('teamName', {
      header: 'Team',
      cell: info => info.getValue() ?? '-',
    }),
    columnHelper.accessor('totalWorkHours', {
      header: 'Sum work hours',
      cell: info => `${info.getValue()} d.h:m:s`,
    }),
    columnHelper.accessor('totalBreakHours', {
      header: 'Sum break hours',
      cell: info => `${info.getValue()} d.h:m:s`,
    }),
    columnHelper.accessor('totalDaysWorked', {
      header: 'Days worked',
    }),
    columnHelper.accessor('totalDaysOff', {
      header: 'Days off',
    }),
  ], []);

  const handleDownload = async (token: string) => {
    try {
      const csvUrl = await getCSVWorkSummary(token);
      const link = document.createElement("a");
      link.href = csvUrl;
      link.download = "work_summary.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(csvUrl);
    } catch {
      // optionally show error
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      <div style={{ width: "80vw" }}>
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
          <div className="ms-2 me-5">
            <label className="form-label">End date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
          <Button className="ms-auto" onClick={handleFindClick}>Find</Button>
        </div>
      </div>

      <div style={{ width: "80vw" }}>
        {data.length > 0 && !isLoading ? (
          <>
            <table className="table table-bordered table-hover mt-4">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        style={{ cursor: header.column.getCanSort() ? "pointer" : "default", userSelect: "none", whiteSpace: "nowrap" }}
                        onClick={header.column.getToggleSortingHandler()}
                        title={header.column.getCanSort() ? "Click to sort" : undefined}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <span style={{ marginLeft: "6px" }}>
                          {header.column.getIsSorted() === "asc" ? "▲" :
                           header.column.getIsSorted() === "desc" ? "▼" : "⇅"}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {token && <Button onClick={() => handleDownload(token)}>Download CSV</Button>}
          </>
        ) : (
          <p className="mt-3 text-warning">
            {message ?? "Please select a project to view the summary."}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectSummaryComponent;