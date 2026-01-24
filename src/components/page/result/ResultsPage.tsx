import { NavBar } from "@/components/shared/NavBar";
import { EmptyState } from "./EmptyState";
import { QuerySection } from "./QuerySection";
import { ResultSection } from "./ResultSection";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export function ResultsPage({ NLInput }: { NLInput: string }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || NLInput;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    async function analyzeQuery() {
      setLoading(true);
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ NLInput: query }),
        });

        const data = await response.json();

        if (data.success) {
          console.log("AI Intent Generated:", data.intent);
        } else {
          console.error("Analysis failed:", data.error);
        }
      } catch (error) {
        console.error("Error fetching analysis:", error);
      } finally {
        setLoading(false);
      }
    }

    analyzeQuery();
  }, [query]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 relative">
      <NavBar />
      <div className="flex-1 flex flex-col items-center">
        <QuerySection query={query} />
        {loading ? (
          <div className="mt-20 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
            <p className="text-gray-500 dark:text-gray-400 animate-pulse">
              Analyzing your query with Gemini...
            </p>
          </div>
        ) : (
          <ResultSection />
        )}
      </div>

      {/* Hide this when results are shown  */}
      <div className="hidden">
        <EmptyState />
      </div>
    </div>
  );
}
