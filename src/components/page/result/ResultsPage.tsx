import { NavBar } from "@/components/shared/NavBar";
import { EmptyState } from "./EmptyState";
import { QuerySection } from "./QuerySection";
import { ResultSection } from "./ResultSection";
import { useSearchParams } from "react-router-dom";

export function ResultsPage({ NLInput }: { NLInput: string }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || NLInput;

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 relative">
      <NavBar />
      <div className="flex-1 flex flex-col items-center">
        <QuerySection query={query} />
        <ResultSection />
      </div>

      {/* Hide this when results are shown  */}
      <div className="hidden">
        <EmptyState />
      </div>
    </div>
  );
}
