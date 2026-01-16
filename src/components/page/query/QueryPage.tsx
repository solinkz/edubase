import { NavBar } from "@/components/shared/NavBar";
import { QueryInput } from "./QueryInput";
import { SuggestionTags } from "./SuggestionTags";

export function QueryPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-20">
        <div className="w-full max-w-3xl px-4 flex flex-col gap-6">
          <h1 className="text-3xl font-medium dark:text-white text-center">
            👋🏼 Hi, What would you like to know today?
          </h1>

          <div className="flex flex-col gap-6">
            <QueryInput />
            <SuggestionTags />
          </div>
        </div>
      </div>
    </div>
  );
}
