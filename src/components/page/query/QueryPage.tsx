import { NavBar } from "@/components/shared/NavBar";
import { QueryInput } from "./QueryInput";
import { BookMarked } from "lucide-react";
import { useState } from "react";

export function QueryPage({
  NLInput,
  setNLInput,
}: {
  NLInput: string;
  setNLInput: (value: string) => void;
}) {
  const [showSuggestion, setShowSuggestion] = useState(false);
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar setNLInput={setNLInput} />
      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-20">
        <div
          className={`w-full max-w-3xl px-4 flex flex-col gap-6 ${showSuggestion ? "mt-[182px]" : ""}`}
        >
          <h1 className="text-3xl font-medium dark:text-white text-center">
            👋🏼 Hi, What would you like to know today?
          </h1>

          <div className="flex flex-col gap-6">
            <QueryInput
              showSuggestion={showSuggestion}
              setShowSuggestion={setShowSuggestion}
              NLInput={NLInput}
              setNLInput={setNLInput}
            />
            <div className="flex justify-center items-center gap-2 text-gray-400 dark:text-gray-500 -mt-2">
              <BookMarked size={16} strokeWidth={2.5} />
              <p className="text-sm font-medium">
                Use Natural language to check information about Students,
                Courses, Teachers, etc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
