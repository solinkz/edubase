/**
 * ResultsPage - Orchestrates the analysis flow and displays query results.
 * Sub-components are grouped by function: sections/, components/, and ui/.
 */
import { NavBar } from "@/components/shared/NavBar";
import { EmptyState } from "./ui/EmptyState";
import { ErrorState } from "./ui/ErrorState";
import { QuerySection } from "./sections/QuerySection";
import { ResultSection } from "./sections/ResultSection";

import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export function ResultsPage({
  NLInput,
  setNLInput,
}: {
  NLInput: string;
  setNLInput: (value: string) => void;
}) {
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
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
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
      setErrorStatus(null);
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
          setCurrentStep("Can't complete processing");

          // Provide specific, user-friendly error messages
          const errorMsg = data.error || "";
          if (
            errorMsg.includes("GEMINI_API_KEY") ||
            errorMsg.includes("API key")
          ) {
            setErrorStatus(
              "The AI service is not configured. Please check your API key settings.",
            );
          } else if (
            errorMsg.includes("quota") ||
            errorMsg.includes("limit") ||
            errorMsg.includes("429")
          ) {
            setErrorStatus(
              "The AI service has reached its usage limit for today. Please try again later or contact support.",
            );
          } else if (
            errorMsg.includes("503") ||
            errorMsg.includes("unavailable")
          ) {
            setErrorStatus(
              "The AI service is temporarily unavailable. This is normal - please try again in a few moments.",
            );
          } else {
            setErrorStatus(
              errorMsg ||
                "Failed to analyze query. Please try rephrasing your question.",
            );
          }
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Error fetching analysis:", error);
          setAnalysisResult(null);
          setCurrentStep("Can't complete processing");

          // Detect network vs server errors
          if (
            error.message?.includes("fetch") ||
            error.message?.includes("network")
          ) {
            setErrorStatus(
              "Unable to connect to the server. Please check your internet connection and ensure the server is running.",
            );
          } else {
            setErrorStatus(
              "An unexpected error occurred. Please try again or contact support if this persists.",
            );
          }
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
      <NavBar setNLInput={setNLInput} />
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
        ) : errorStatus ? (
          <ErrorState
            title="We couldn't complete the analysis"
            message={errorStatus}
            solution={
              errorStatus.includes("limit") || errorStatus.includes("quota")
                ? "The service will reset automatically. You can try again later or contact your administrator."
                : errorStatus.includes("unavailable")
                  ? "This is usually temporary. Please wait a moment and try your query again."
                  : "Try rephrasing your question or check that your database connection is active."
            }
          />
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
