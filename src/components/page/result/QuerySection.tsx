interface QuerySectionProps {
  query: string;
}

export function QuerySection({ query }: QuerySectionProps) {
  return (
    <div className="flex text-sm pl-2">
      <span className="font-medium">Query:</span>
      <span className="text-gray-500 dark:text-gray-400">{`“${query}”`}</span>
    </div>
  );
}
