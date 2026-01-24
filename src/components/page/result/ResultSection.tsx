import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CloudDownload, Grid3X3, Text } from "lucide-react";
import { DataTable } from "./DataTable";

const DEFAULT_HEADERS = ["Name", "Reason", "Facility", "Status", "Cost"];
const DEFAULT_DATA = [
  {
    name: "Alice Johnson",
    reason: "Fever",
    facility: "General Hospital",
    status: "Admitted",
    cost: "$1,200",
  },
  {
    name: "Bob Smith",
    reason: "Injury",
    facility: "City Clinic",
    status: "Discharged",
    cost: "$800",
  },
  {
    name: "Charlie Brown",
    reason: "Checkup",
    facility: "West Side Med",
    status: "Pending",
    cost: "$150",
  },
  {
    name: "Diana Prince",
    reason: "Surgery",
    facility: "Central Care",
    status: "Admitted",
    cost: "$5,000",
  },
];

export function ResultSection() {
  return (
    <div
      className={`w-full max-w-3xl pt-8 flex border-t border-gray-200 dark:border-gray-700 flex-col gap-2 mt-8`}
    >
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
        Showing {42} students admission from KK22 in the last 24 hours
      </p>
      <div className="flex flex-col">
        {/* Tabs */}
        <Tabs defaultValue="table" className="w-full">
          <div className="flex justify-between">
            <TabsList className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <TabsTrigger value="table" className="rounded-lg cursor-pointer">
                <Grid3X3 />
                Table
              </TabsTrigger>
              <TabsTrigger
                value="summary"
                className="rounded-lg cursor-pointer"
              >
                <Text />
                Summary
              </TabsTrigger>
            </TabsList>

            <Button
              variant="outline"
              size="sm"
              className="bg-gray-100 dark:bg-gray-800 cursor-pointer shadow-none"
            >
              Export CSV
              <CloudDownload />
            </Button>
          </div>
          {/* Table */}

          <TabsContent value="table">
            <div className="mt-2 p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg min-h-[200px]">
              <DataTable headers={DEFAULT_HEADERS} data={DEFAULT_DATA} />
            </div>
          </TabsContent>
          <TabsContent value="summary">
            <div className="mt-2 p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg min-h-[200px] flex items-center justify-center border-dashed">
              <span className="text-sm text-gray-400 dark:text-gray-500">
                Summary Results will appear here...
              </span>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
