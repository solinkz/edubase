import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3X3, Text } from "lucide-react";

export function ResultSection() {
  return (
    <div className="flex flex-col">
      {/* Tabs */}
      <Tabs defaultValue="table" className="w-full">
        <TabsList className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
          <TabsTrigger value="table" className="rounded-lg">
            <Grid3X3 />
            Table
          </TabsTrigger>
          <TabsTrigger value="summary" className="rounded-lg">
            <Text />
            Summary
          </TabsTrigger>
        </TabsList>
        {/* Table */}

        <TabsContent value="table">
          <div className="mt-2 p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg min-h-[200px] flex items-center justify-center border-dashed">
            <span className="text-sm text-gray-400 dark:text-gray-500">
              Table Results will appear here...
            </span>
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
  );
}
