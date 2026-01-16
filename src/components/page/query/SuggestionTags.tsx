import { Button } from "@/components/ui/button";

const Suggestions = [
  "Student performance",
  "At-risk students",
  "Class & subject trends",
  "Class comparisons",
];

export function SuggestionTags() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      {Suggestions.map((suggestion) => (
        <Button
          key={suggestion}
          variant="secondary"
          className="rounded-full text-sm text-gray-500 border border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-200 hover:border-gray-300 dark:hover:border-gray-800 dark:hover:bg-gray-800"
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
