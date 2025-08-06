import React from 'react';
import { flexRender, type Table } from '@tanstack/react-table';

interface RenderTableProps {
  table: Table<any>;
}

export const RenderTable: React.FC<RenderTableProps> = ({ table }) => (
  <div className="table-responsive mt-4">
    <table className="table table-striped table-bordered table-hover align-middle shadow-sm">
      <thead className="table-light">
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th
                key={header.id}
                style={{
                  cursor: header.column.getCanSort() ? 'pointer' : 'default',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  verticalAlign: 'middle',
                }}
                onClick={header.column.getToggleSortingHandler()}
                title={header.column.getCanSort() ? 'Click to sort' : undefined}
              >
                <div className="d-flex align-items-center">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getCanSort() && (
                    <span className="ms-2 text-muted">
                      {header.column.getIsSorted() === 'asc' ? '▲' : 
                       header.column.getIsSorted() === 'desc' ? '▼' : '⇅'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} style={{ verticalAlign: 'middle' }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
