import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Construction } from "lucide-react";

export function SummaryEmptyState() {
  return (
    <Empty className="py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-gray-100 dark:bg-gray-800">
          <Construction className="text-gray-500" />
        </EmptyMedia>
        <EmptyTitle>Coming soon</EmptyTitle>
        <EmptyDescription>
          We're working on making your data summaries readable and insightful.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
