import { NavBar } from "@/components/shared/NavBar";
import { EmptyState } from "./EmptyState";
import { QuerySection } from "./QuerySection";
import { ProcessShowcase } from "./ProcessShowcase";
import { ResultSection } from "./ResultSection";

export function ResultsPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 relative">
      <NavBar />
      <div className="flex-1 flex flex-col items-center">
        <div
          className={`w-full max-w-3xl p-1 pt-2 flex flex-col gap-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mt-20 rounded-xl`}
        >
          <QuerySection query="I would like to find out how many students from KK22 have been admitted in the last 24 hours?" />

          {/* Process showcase */}
          <ProcessShowcase />
        </div>
        {/* Results section */}
        <div
          className={`w-full max-w-3xl pt-8 flex border-t border-gray-200 dark:border-gray-700 flex-col gap-2 mt-8`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Showing {42} students admission from KK22 in the last 24 hours
          </p>
          <ResultSection />
        </div>
      </div>
      <EmptyState />
    </div>
  );
}
