import { ProcessShowcase } from "./ProcessShowcase";

interface QuerySectionProps {
  query: string;
}

export function QuerySection({ query }: QuerySectionProps) {
  return (
    <div
      className={`w-full max-w-3xl p-1 pt-2 flex flex-col gap-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mt-20 rounded-xl`}
    >
      <div className="flex text-sm pl-2">
        <span className="font-medium">Query:</span>
        <span className="text-gray-500 dark:text-gray-400">{`“${query}”`}</span>
      </div>

      <ProcessShowcase />
    </div>
  );
}
