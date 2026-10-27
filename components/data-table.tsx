"use client";
import { useMemo, useState } from "react";
import { Search, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Avatar, Badge } from "./shared";
import { money, type RecordRow } from "@/lib/data";
export function DataTable({
  rows,
  page,
  onView,
  compact = false,
}: {
  rows: RecordRow[];
  page: string;
  onView: (row: RecordRow) => void;
  compact?: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useMemo<ColumnDef<RecordRow>[]>(
    () => [
      {
        accessorKey: "name",
        header:
          page === "admin-users" || page === "audit-logs"
            ? "Administrator"
            : page === "notifications"
              ? "Notification / audience"
              : "Customer",
        cell: ({ row }) => (
          <div className="person">
            <Avatar name={row.original.name} />
            <div>
              <b>{row.original.name}</b>
              <small>{row.original.id}</small>
            </div>
          </div>
        ),
      },
      ...(!compact
        ? [
            {
              accessorKey: "email",
              header:
                page === "support"
                  ? "Subject"
                  : page === "audit-logs"
                    ? "Activity"
                    : "Contact",
              cell: ({ row }: { row: { original: RecordRow } }) =>
                page === "support"
                  ? row.original.subject
                  : page === "audit-logs"
                    ? `${row.original.type} record updated`
                    : row.original.email,
            },
          ]
        : []),
      {
        accessorKey: "amount",
        header:
          page === "users" || page === "limits"
            ? "Credit limit"
            : page === "payments"
              ? "Amount due"
              : "Amount",
        cell: ({ row }) => (
          <b className="amount">{money(row.original.amount)}</b>
        ),
      },
      ...(!compact && page === "users"
        ? [
            {
              accessorKey: "kyc",
              header: "KYC",
              cell: ({ row }: { row: { original: RecordRow } }) => (
                <Badge value={row.original.kyc} />
              ),
            },
            {
              accessorKey: "balance",
              header: "Available balance",
              cell: ({ row }: { row: { original: RecordRow } }) =>
                money(row.original.balance),
            },
          ]
        : []),
      ...(!compact && ["withdrawals", "payments", "transactions"].includes(page)
        ? [
            { accessorKey: "method", header: "Payment method" },
            {
              accessorKey: "type",
              header: page === "transactions" ? "Type" : "Payment details",
              cell: ({ row }: { row: { original: RecordRow } }) =>
                page === "transactions" ? row.original.type : "•••• 4281",
            },
          ]
        : []),
      ...(!compact && page === "support"
        ? [
            { accessorKey: "priority", header: "Priority" },
            { accessorKey: "agent", header: "Assigned agent" },
          ]
        : []),
      ...(!compact && page === "admin-users"
        ? [
            { accessorKey: "role", header: "Role" },
            {
              id: "lastActive",
              accessorFn: (r: RecordRow) => r.date,
              header: "Last active",
            },
          ]
        : []),
      ...(!compact && page === "payments"
        ? [
            {
              id: "paid",
              accessorFn: (r: RecordRow) =>
                r.status === "Paid" ? r.amount : 0,
              header: "Amount paid",
              cell: ({ row }: { row: { original: RecordRow } }) =>
                money(row.original.status === "Paid" ? row.original.amount : 0),
            },
            {
              id: "due",
              header: "Due date",
              cell: ({ row }: { row: { original: RecordRow } }) =>
                row.original.status === "Overdue"
                  ? "24 Oct 2026 · Overdue"
                  : "28 Oct 2026",
            },
          ]
        : []),
      ...(!compact && page === "audit-logs"
        ? [
            { accessorKey: "agent", header: "Performed by" },
            { accessorKey: "type", header: "Module" },
          ]
        : []),
      ...(!compact && page === "notifications"
        ? [{ accessorKey: "subject", header: "Message" }]
        : []),
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge value={row.original.status} />,
      },
      ...(!compact
        ? [
            {
              accessorKey: "date",
              header: "Date",
              cell: ({ row }: { row: { original: RecordRow } }) =>
                new Date(row.original.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
            },
          ]
        : []),
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <button
            className="icon-button"
            aria-label={`View ${row.original.name}`}
            onClick={() => onView(row.original)}
          >
            <ArrowUpRight size={17} />
          </button>
        ),
      },
    ],
    [page, onView, compact],
  );
  const table = useReactTable({
    data: rows,
    columns: columns.filter(
      (c) =>
        !(
          [
            "support",
            "admin-users",
            "audit-logs",
            "notifications",
            "kyc",
          ].includes(page) &&
          "accessorKey" in c &&
          c.accessorKey === "amount"
        ),
    ),
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: compact ? 5 : 8 } },
  });
  return (
    <>
      <div className="table-scroll">
        <table>
          <thead>
            {table.getHeaderGroups().map((g) => (
              <tr key={g.id}>
                {g.headers.map((h) => (
                  <th key={h.id}>
                    <button onClick={h.column.getToggleSortingHandler()}>
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getIsSorted() ? " ↕" : ""}
                    </button>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((r) => (
              <tr key={r.id}>
                {r.getVisibleCells().map((c) => (
                  <td key={c.id}>
                    {flexRender(c.column.columnDef.cell, c.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="empty">
            <Search />
            <h3>No records found</h3>
            <p>Try a different search or filter.</p>
          </div>
        )}
      </div>
      {!compact && (
        <div className="pagination">
          <span>
            {rows.length} records · Page{" "}
            {table.getState().pagination.pageIndex + 1} of{" "}
            {Math.max(1, table.getPageCount())}
          </span>
          <div>
            <button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
