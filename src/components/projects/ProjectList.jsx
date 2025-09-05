import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { FiChevronDown, FiChevronUp, FiMoreHorizontal } from "react-icons/fi";
import { ProjectActionModal } from "../ui/ProjectActionModal";

export default function ProjectList({ projects = [], onViewSuites, onDeleteProject }) {
  const [showDelete, setShowDelete] = useState(null);



  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "uniqueProjectId",
      },
      {
        Header: "Title",
        accessor: "name",
      },
      {
        Header: "Status",
        accessor: "isActive",
        Cell: ({ cell: { value } }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {value ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        Header: "Work Items",
        accessor: "workItems",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="relative text-right">
            <FiMoreHorizontal
              className="cursor-pointer text-gray-600 hover:text-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                setShowDelete((prev) => (prev === row.original.id ? null : row.original.id));
              }}
            />
            {showDelete === row.original.id && (
              <ProjectActionModal
                isOpen={showDelete === row.original.id}
                onDelete={(projectId) => onDeleteProject(projectId)}
                onClose={() => setShowDelete(null)} 
                projectId={row.original.id} 
              />
            )}
          </div>
        ),
      },
    ],
    [showDelete]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: projects,
    },
    useSortBy
  );

  return (
    <div className="overflow-x-auto">
      <table {...getTableProps()} className="min-w-full bg-white border-separate border-spacing-0">
        <thead>
          {headerGroups.map((headerGroup) => {
            const { key, ...headerProps } = headerGroup.getHeaderGroupProps();

            return (
              <tr
                key={key} 
                {...headerProps} 
                className="text-left bg-gray-100 border-b"
              >
                {headerGroup.headers.map((column) => {
                  const { key: columnKey, ...columnProps } = column.getHeaderProps(column.getSortByToggleProps());

                  return (
                    <th
                      key={columnKey} 
                      {...columnProps} 
                      className="py-2 px-4 font-semibold text-gray-700 cursor-pointer"
                    >
                      {column.render("Header")}
                      <span className="inline-block ml-2">
                        <FiChevronUp
                          className={`${
                            column.isSorted && !column.isSortedDesc ? "text-blue-600" : "text-gray-600"
                          }`}
                        />
                        <FiChevronDown
                          className={`${
                            column.isSorted && column.isSortedDesc ? "text-blue-600" : "text-gray-600"
                          }`}
                        />
                      </span>
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                key={row.original.id} 
                {...row.getRowProps()} 
                className="border-b cursor-pointer hover:bg-gray-100"
                onClick={() => onViewSuites(row.original.id)} 
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="py-2 px-4 text-sm text-gray-600">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
