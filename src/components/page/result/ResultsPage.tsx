import { NavBar } from "@/components/shared/NavBar";
import { EmptyState } from "./EmptyState";

export function ResultsPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <EmptyState/>
    </div>
  );
}
