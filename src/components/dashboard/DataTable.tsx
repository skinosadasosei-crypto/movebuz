"use client";

import { useState } from "react";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (row: any) => React.ReactNode;
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowClick?: (row: any) => void;
  defaultSortKey?: string;
  defaultSortDir?: "asc" | "desc";
}

export default function DataTable({
  columns,
  data,
  onRowClick,
  defaultSortKey,
  defaultSortDir = "desc",
}: DataTableProps) {
  const [sortKey, setSortKey] = useState(defaultSortKey || "");
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSortDir);

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    }
    return sortDir === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--dash-border)" }}>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-2.5 px-3 text-xs font-medium whitespace-nowrap ${
                  col.sortable ? "cursor-pointer select-none hover:text-slate-900" : ""
                }`}
                style={{
                  color: "var(--dash-text-secondary)",
                  textAlign: col.align || "left",
                  width: col.width,
                }}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {sortDir === "desc" ? (
                        <polyline points="6 9 12 15 18 9" />
                      ) : (
                        <polyline points="18 15 12 9 6 15" />
                      )}
                    </svg>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr
              key={i}
              className={onRowClick ? "cursor-pointer" : ""}
              style={{ borderBottom: "1px solid var(--dash-border)" }}
              onClick={() => onRowClick?.(row)}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="py-2.5 px-3 whitespace-nowrap"
                  style={{
                    color: "var(--dash-text)",
                    textAlign: col.align || "left",
                  }}
                >
                  {col.render ? col.render(row) : String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
