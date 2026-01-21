import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { QuerySuggestion } from "./QuerySuggestion";
import { useState } from "react";

export function QueryInput({
  showSuggestion,
  setShowSuggestion,
}: {
  showSuggestion: boolean;
  setShowSuggestion: (value: boolean) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const handleFocus = () => {
    if (inputValue === "") {
      setShowSuggestion(true);
    }
  };

  const handleBlur = () => {
    // Timeout to allow potential clicks on suggestions if needed in the future
    setTimeout(() => setShowSuggestion(false), 200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value !== "") {
      setShowSuggestion(false);
    } else {
      setShowSuggestion(true);
    }
  };

  return (
    <div className="flex flex-col border border-gray-200 dark:border-gray-700 min-h-14 rounded-3xl shadow-xs bg-white dark:bg-gray-800 overflow-hidden">
      <div className="flex items-center flex-1 px-1 py-2">
        <Input
          placeholder="Ask anything..."
          className="text-lg bg-transparent dark:bg-transparent placeholder:text-gray-400 focus-visible:ring-0 shadow-none border-0"
          value={inputValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onClick={handleFocus}
        />

        <Button
          size="icon"
          variant="secondary"
          className="rounded-full p-3 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <SendHorizonal size={20} className="" />
        </Button>
      </div>

      {/* Suggestions on click */}
      <QuerySuggestion showSuggestion={showSuggestion} />
    </div>
  );
}
