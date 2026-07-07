import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Text from "./ui/Text";
import Button from "./ui/Button";

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T, value: unknown) => ReactNode;
  className?: string;
  align?: "left" | "center";
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading: boolean;
  emptyMessage?: string;
  rowKey?: keyof T | string;
  onRowClick?: (item: T) => void;
  className?: string;

  pagination?: {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
}

export default function GenericTable<
  T extends Record<string, unknown> = Record<string, unknown>
>({
  data,
  columns,
  loading,
  emptyMessage = "No data found",
  rowKey = "id",
  onRowClick,
  className = "",
  pagination,
}: TableProps<T>) {
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!pagination) return;

    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= pagination.totalPages) {
      pagination.onPageChange(value);
    }
  };

  const resultsEnd = pagination
    ? Math.min(
        pagination.currentPage * pagination.pageSize,
        pagination.totalResults
      )
    : 0;

  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-white rounded-3xl overflow-hidden border border-ui-border shadow-sm">
        <div
          className={`overflow-x-auto ${
            loading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-ui-border">
                {columns.map((column, idx) => {
                  const alignmentClass = column.align === "center" ? "text-center" : "text-left";
                  
                  return (
                    <th
                      key={idx}
                      className={`px-6 py-4 text-[13px] font-bold text-ui-text-muted uppercase tracking-wider ${alignmentClass} ${
                        column.className || ""
                      }`}
                    >
                      {column.label}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-ui-border/50">
              {safeData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-ui-text-muted text-sm"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                safeData.map((item, idx) => (
                  <tr
                    key={String(item[rowKey] || idx)}
                    className={`group hover:bg-brand-primary/2 transition-colors cursor-pointer ${
                      onRowClick ? "" : "cursor-default"
                    }`}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((column, colIdx) => {
                      const value = item[column.key as keyof T];

                      const cellContent = column.render 
                        ? column.render(item, value) 
                        : String(value || '-');

                      const tooltipValue =
                        typeof cellContent === "string" || typeof cellContent === "number"
                          ? String(cellContent)
                          : undefined;

                      // FIX: Applies flex item grouping overrides if column is explicitly centered
                      const cellAlignmentClass =
                        column.align === "center"
                          ? "text-center [&&>*]:mx-auto [&&>*]:justify-center"
                          : "text-left";

                      return (
                        <td
                          key={colIdx}
                          title={tooltipValue}
                          className={`px-6 py-4 text-sm text-ui-text-main font-medium max-w-[260px] overflow-hidden text-ellipsis whitespace-nowrap ${cellAlignmentClass} ${
                            column.className || ""
                          }`}
                        >
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Container */}
      {pagination && (
        <div className="flex flex-col items-end gap-4 py-2">
          <div className="flex items-center gap-3 bg-ui-card p-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<ChevronLeft size={18} />}
              disabled={pagination.currentPage <= 1}
              onClick={() =>
                pagination.onPageChange(pagination.currentPage - 1)
              }
            />

            <div className="flex items-center gap-2 px-2 border-ui-border/50">
              <input
                type="number"
                value={pagination.currentPage}
                onChange={handlePageInputChange}
                className="w-12 h-9 text-center bg-brand-light border border-ui-border rounded-lg text-sm font-bold text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <Text variant="small" weight="bold" color="muted">
                of {pagination.totalPages}
              </Text>
            </div>

            <Button
              variant="ghost"
              size="sm"
              icon={<ChevronRight size={18} />}
              disabled={
                pagination.currentPage >= pagination.totalPages
              }
              onClick={() =>
                pagination.onPageChange(pagination.currentPage + 1)
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-brand-light/30 rounded-full">
              <Text variant="small" weight="bold" color="muted">
                Showing
              </Text>
              <Text variant="small" weight="bold" color="primary">
                {resultsEnd}
              </Text>
              <Text variant="small" weight="bold" color="muted">
                of {pagination.totalResults} results
              </Text>
            </span>
            <span className="w-1 h-1 bg-ui-border rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}
