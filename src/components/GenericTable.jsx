import { useEffect, useRef, useState } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

export default function GenericTable({
  columns,
  data,
  rowKey = "id",
  emptyMessage = "No data found",
  className = "",
}) {
  const tableContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const getAlignmentClass = (alignment = "left") => {
    switch (alignment) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  const checkScroll = () => {
    const element = tableContainerRef.current;

    if (!element) return;

    const { scrollLeft, scrollWidth, clientWidth } = element;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const scrollLeft = () => {
    if (!tableContainerRef.current) return;

    tableContainerRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!tableContainerRef.current) return;

    tableContainerRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const element = tableContainerRef.current;

    if (!element) return;

    checkScroll();

    element.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      element.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [columns, data]);

  const firstColumnWidth = columns[0]?.width || columns[0]?.minWidth || "200px";

  return (
    <div
      className={`relative flex-1 min-h-0 w-full overflow-hidden rounded-xl bg-white/20 backdrop-blur-md border border-gray-200 ${className}`}
    >
      <div
        ref={tableContainerRef}
        className="w-full h-full overflow-auto scrollbar-hide"
      >
        <table
          className="border-separate border-spacing-0 text-sm"
          style={{ width: "max-content", minWidth: "100%" }}
        >
          <thead>
            <tr className="h-14.5 bg-[#EAF6F4] backdrop-blur-[20px] backdrop-saturate-100 shadow-[0_4px_25px_rgba(0,0,0,0.04)]">
              {columns.map((column, index) => {
                const isFirstColumn = index === 0;
                const isLastColumn = index === columns.length - 1;
                return (
                  <th
                    key={column.key}
                    style={{
                      width: column.width,
                      minWidth: column.minWidth || column.width,
                      maxWidth: column.maxWidth,
                    }}
                    className={`px-5 py-4 text-[15px] font-medium text-[#111] whitespace-nowrap border-b border-gray-200 ${!isLastColumn ? "border-r border-gray-200" : ""} ${getAlignmentClass(column.headerAlign ?? column.align)} ${column.headerClassName || ""} ${isFirstColumn ? "sticky left-0 z-30 bg-[#EAF6F4] border-r border-gray-200 shadow-[4px_0_8px_rgba(0,0,0,0.04)] rounded-tl-[15px]" : ""} ${isLastColumn ? "rounded-tr-[24px]" : ""}`}
                  >
                    {column.header}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={row[rowKey] ?? rowIndex}
                  className="h-13 border-t border-gray-200 hover:bg-[#F7FCFB] transition-colors"
                >
                  {columns.map((column, columnIndex) => {
                    const isFirstColumn = columnIndex === 0;

                    return (
                      <td
                        key={column.key}
                        style={{
                          width: column.width,
                          minWidth: column.minWidth || column.width,
                          maxWidth: column.maxWidth,
                        }}
                        className={`px-5 py-3 text-[15px] text-[#1A1A1A] whitespace-nowrap overflow-hidden text-ellipsis border-b border-gray-200 ${columnIndex !== columns.length - 1 ? "border-r border-gray-200" : ""} ${getAlignmentClass(column.align)} ${column.cellClassName || ""} ${isFirstColumn ? "sticky left-0 z-20 bg-white border-r border-gray-200 shadow-[4px_0_8px_rgba(0,0,0,0.04)]" : ""}`}
                      >
                        {column.render
                          ? column.render(row, rowIndex)
                          : (row[column.key] ?? "-")}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-36 text-center text-gray-500 text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {canScrollLeft && (
        <button
          type="button"
          onClick={scrollLeft}
          className="absolute top-0 h-[58px] w-10 flex items-center justify-center bg-[#EAF6F4] hover:bg-[#DBEFEC] transition-colors cursor-pointer z-40"
          style={{ left: firstColumnWidth }}
        >
          <ChevronsLeft size={16} className="text-gray-500" />
        </button>
      )}

      {canScrollRight && (
        <button
          type="button"
          onClick={scrollRight}
          className="absolute top-0 right-0 h-[58px] w-10 flex items-center justify-center bg-[#EAF6F4] hover:bg-[#DBEFEC] transition-colors cursor-pointer z-40"
        >
          <ChevronsRight size={16} className="text-gray-500" />
        </button>
      )}
    </div>
  );
}
