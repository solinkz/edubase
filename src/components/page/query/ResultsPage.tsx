import { NavBar } from "@/components/shared/NavBar";

export function ResultsPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-medium dark:text-white">Search Results</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          This is an empty results page placeholder.
        </p>
      </div>
    </div>
  );
}

export default ResultsPage;
