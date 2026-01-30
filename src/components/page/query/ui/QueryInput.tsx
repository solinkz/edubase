/**
 * QueryInput - A styled input field with Enter-to-send support
 * and integrated natural language query suggestions.
 */
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import { QuerySuggestion } from "./QuerySuggestion";
import { useNavigate } from "react-router-dom";

export function QueryInput({
  showSuggestion,
  setShowSuggestion,
  NLInput,
  setNLInput,
}: {
  showSuggestion: boolean;
  setShowSuggestion: (value: boolean) => void;
  NLInput: string;
  setNLInput: (value: string) => void;
}) {
  const navigate = useNavigate();
  const handleFocus = () => {
    if (NLInput === "") {
      setShowSuggestion(true);
    }
  };

  const handleBlur = () => {
    // Timeout to allow potential clicks on suggestions if needed in the future
    setTimeout(() => setShowSuggestion(false), 200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNLInput(value);
    if (value !== "") {
      setShowSuggestion(false);
    } else {
      setShowSuggestion(true);
    }
  };

  const handleSend = () => {
    if (NLInput === "") return;
    // Persist query in URL search parameter so it survives page refresh
    navigate(`/results?q=${encodeURIComponent(NLInput)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col border border-gray-200 dark:border-gray-700 min-h-10 rounded-3xl shadow-xs bg-white dark:bg-gray-800 overflow-hidden">
      <div className="flex items-center flex-1 px-1 py-1.5">
        <Input
          placeholder="Ask anything..."
          className="text-lg bg-transparent dark:bg-transparent placeholder:text-gray-400 focus-visible:ring-0 shadow-none border-0"
          value={NLInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onClick={handleFocus}
          onKeyDown={handleKeyDown}
        />

        <Button
          size="icon"
          variant="secondary"
          className="rounded-full p-3 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={handleSend}
        >
          <SendHorizonal size={20} className="" />
        </Button>
      </div>

      {/* Suggestions on click */}
      <QuerySuggestion
        showSuggestion={showSuggestion}
        setNLInput={setNLInput}
      />
    </div>
  );
}
