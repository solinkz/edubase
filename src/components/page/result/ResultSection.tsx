import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  CloudDownload,
  Grid3X3,
  Text,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DataTable } from "./DataTable";
import { determineViewType, explainViewSelection } from "@/lib/viewSelector";
import { useEffect, useState } from "react";
import { SummaryEmptyState } from "./SummaryEmptyState";

interface Filter {
  column: string;
  operator: string;
  value: string | number | boolean | (string | number)[] | null;
  logicalOperator?: "AND" | "OR";
}

interface Intent {
  table: string;
  fields?: { column: string; alias?: string }[];
  filters?: Filter[];
  aggregations?: { function: string; column: string; alias?: string }[];
  groupBy?: string[];
  distinct?: boolean;
}

interface ResultSectionProps {
  intent: Intent;
  data: Record<string, unknown>[];
  metadata: { rowCount: number };
}

export function ResultSection({ intent, data, metadata }: ResultSectionProps) {
  // Deterministically select the recommended view based on query characteristics
  // Since we use a 'key' on this component in ResultsPage, this initial state
  // will be re-initialized whenever the query results change.
  const recommendedView = determineViewType(intent, data);
  const [activeTab, setActiveTab] = useState<string>(recommendedView);

  // Pagination state
  const ROWS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Log recommendation for transparency
  useEffect(() => {
    console.log("View Recommendation:", explainViewSelection(intent, data));
  }, [intent, data]);

  // Calculate pagination values
  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedData = data.slice(startIndex, startIndex + ROWS_PER_PAGE);

  // Convert data to table format (extract headers from first row)
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const tableData = paginatedData.map((row) => {
    const formattedRow: Record<string, unknown> = {};
    headers.forEach((header) => {
      formattedRow[header] = row[header];
    });
    return formattedRow;
  });

  // Generate a human-readable text-based summary of the results
  const generateTextSummary = () => {
    if (data.length === 0)
      return "Search returned no results. Try adjusting your query.";

    const count = data.length;
    let summaryText = "";

    // Case 1: Pure Aggregation (e.g., "What is the total count of students?")
    if (
      intent.aggregations &&
      intent.aggregations.length > 0 &&
      (!intent.groupBy || intent.groupBy.length === 0)
    ) {
      const firstRow = data[0];
      const metrics = Object.entries(firstRow).map(([key, val]) => {
        const label = key.replace(/_/g, " ");
        const value =
          typeof val === "number"
            ? val.toLocaleString(undefined, { maximumFractionDigits: 2 })
            : String(val);
        return `the ${label} is ${value}`;
      });
      summaryText = `Based on your request, I found that ${metrics.join(" and ")}.`;
    }
    // Case 2: Grouped Data (e.g., "Average QPA by country")
    else if (intent.groupBy && intent.groupBy.length > 0) {
      summaryText = `I've analyzed the data for ${count} unique categories grouped by ${intent.groupBy.join(", ")}. `;
      if (data.length > 0) {
        summaryText += `The highest result is for ${Object.values(data[0])[0]}, and the average distribution is visible in the table.`;
      }
    }
    // Case 3: List/Filter Data (e.g., "Show students from Canada")
    else {
      summaryText = `I found ${count} student records that match your criteria. `;
      if (intent.filters && intent.filters.length > 0) {
        const filterDesc = intent.filters
          .map((f: Filter) => `${f.column} is ${f.value}`)
          .join(", ");
        summaryText += `Specifically, where ${filterDesc}. `;
      }
      summaryText += "You can see the detailed list in the table view.";
    }

    return (
      <div className="space-y-4 py-2">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Result Summary
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
          {summaryText}
        </p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-3xl pt-8 flex border-t border-gray-200 dark:border-gray-700 flex-col gap-2 mt-8">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
        Found {metadata.rowCount} result{metadata.rowCount !== 1 ? "s" : ""}
      </p>
      <div className="flex flex-col">
        {/* Tabs - Default view is determined by rules */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <TabsTrigger
                value="table"
                className="rounded-lg cursor-pointer flex items-center gap-2"
              >
                <Grid3X3 size={16} />
                Table
              </TabsTrigger>
              <TabsTrigger
                value="summary"
                className="rounded-lg cursor-pointer flex items-center gap-2"
              >
                <Text size={16} />
                Summary
              </TabsTrigger>
            </TabsList>

            <Button
              variant="outline"
              size="sm"
              className="bg-gray-100 dark:bg-gray-800 cursor-pointer shadow-none flex items-center gap-2"
            >
              Export CSV
              <CloudDownload size={16} />
            </Button>
          </div>

          {/* Table View with Pagination */}
          <TabsContent value="table" className="space-y-4">
            <div className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg min-h-[200px]">
              <DataTable headers={headers} data={tableData} />
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Summary View - Text Based */}
          <TabsContent value="summary">
            <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg min-h-[200px] flex flex-col justify-center">
              <SummaryEmptyState />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
