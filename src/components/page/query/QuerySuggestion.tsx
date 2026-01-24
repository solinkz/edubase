import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuerySuggestion({
  showSuggestion,
  setNLInput,
}: {
  showSuggestion: boolean;
  setNLInput: (value: string) => void;
}) {
  const inputSuggestions = [
    "Show the most frequently registered course in Kigali this quarter.",
    "Which students are at risk of failing in Mathematics?",
    "Compare the average grades between Class A and Class B.",
    "What is the trend of student attendance over the last month?",
  ];

  const navigate = useNavigate();
  const handleSuggestionClick = (suggestion: string) => {
    setNLInput(suggestion);
    // Persist suggestion in URL search parameter for refresh survival
    navigate(`/results?q=${encodeURIComponent(suggestion)}`);
  };
  return (
    <ul className={showSuggestion ? "pb-1" : "hidden"}>
      {inputSuggestions.map((suggestion, index) => (
        <li
          key={index}
          className="border-t border-gray-200 dark:border-gray-700"
        >
          <a
            onClick={() => handleSuggestionClick(suggestion)}
            href="#"
            className="group flex items-center gap-2 px-4 pl-3 py-3 text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-400"
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
  );
}
