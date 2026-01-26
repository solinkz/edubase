import { NavBar } from "@/components/shared/NavBar";
import { EmptyState } from "./EmptyState";
import { QuerySection } from "./QuerySection";
import { ResultSection } from "./ResultSection";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export function ResultsPage({ NLInput }: { NLInput: string }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || NLInput;
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    intent: Record<string, unknown>;
    data: Record<string, unknown>[];
    sql: string;
    metadata: { rowCount: number };
  } | null>(null);

  const [currentStep, setCurrentStep] = useState<string>("");
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      setCurrentStep("Processing stopped");
    }
  };

  useEffect(() => {
    if (!query) return;

    async function analyzeQuery() {
      setLoading(true);
      setTimeTaken(null);
      const startTime = performance.now();
      abortControllerRef.current = new AbortController();

      try {
        // Step 1: Identification
        setCurrentStep("Identifying data needed...");
        await new Promise((resolve) => setTimeout(resolve, 800)); // Visual delay

        // Step 2: Fetching/Analyzing
        setCurrentStep("Filtering and retrieving data...");

        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ NLInput: query }),
          signal: abortControllerRef.current.signal,
        });

        const data = await response.json();

        if (data.success) {
          console.log("AI Intent Generated:", data.intent);
          console.log("SQL Generated:", data.sql); // Kept this line from original
          console.log("Query Results:", data.data); // Kept this line from original

          // Final Step: Completion
          setCurrentStep("Processing complete");
          setAnalysisResult(data);
          const endTime = performance.now();
          setTimeTaken(Number((endTime - startTime).toFixed(0)));
        } else {
          console.error("Analysis failed:", data.error);
          setAnalysisResult(null);
          setCurrentStep("Error processing request");
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Error fetching analysis:", error);
          setAnalysisResult(null);
          setCurrentStep("Connection error");
        }
      } finally {
        setLoading(false);
      }
    }

    analyzeQuery();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 relative">
      <NavBar />
      <div className="flex-1 flex flex-col items-center">
        <QuerySection
          query={query}
          isProcessing={loading}
          currentStep={currentStep}
          timeTaken={timeTaken}
          onStop={handleStop}
          generatedSql={analysisResult?.sql || null}
        />

        {loading ? (
          <div className="w-full flex-1 flex items-center justify-center">
            <EmptyState />
          </div>
        ) : analysisResult ? (
          <ResultSection
            key={query} // Reset internal state (activeTab, currentPage) when query changes
            intent={analysisResult.intent as any}
            data={analysisResult.data}
            metadata={analysisResult.metadata}
          />
        ) : null}
      </div>

      {/* Removed the hidden EmptyState div */}
    </div>
  );
}
