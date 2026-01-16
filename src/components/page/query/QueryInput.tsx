import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, SendHorizonal } from "lucide-react";

const inputSuggestions = [
  "Show the most frequently registered course in Kigali this quarter.",
  "Which students are at risk of failing in Mathematics?",
  "Compare the average grades between Class A and Class B.",
  "What is the trend of student attendance over the last month?",
];

export function QueryInput() {
  return (
    <div className="flex flex-col border border-gray-200 dark:border-gray-700 min-h-14 rounded-3xl shadow-xs bg-white dark:bg-gray-800 overflow-hidden">
      <div className="flex items-center flex-1 px-1 py-2">
        <Input
          placeholder="Ask anything..."
          className="text-lg placeholder:text-gray-400 focus-visible:ring-0 shadow-none border-0"
        />

        <Button
          size="icon"
          variant="secondary"
          className="rounded-full p-3 bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <SendHorizonal size={20} className="text-gray-500" />
        </Button>
      </div>

      {/* Suggestions on click */}
      <ul className="pb-1">
        {inputSuggestions.map((suggestion, index) => (
          <li
            key={index}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <a
              href="#"
              className="group flex items-center gap-2 px-4 pl-3 py-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400"
            >
              <span className="flex-1 text-sm">{suggestion}</span>
              <ArrowRight
                size={18}
                className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
