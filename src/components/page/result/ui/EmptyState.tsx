import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Snowflake } from "lucide-react";
/**
 * EmptyState - Initial/loading skeleton for the results area.
 */
export function EmptyState() {
  return (
    <Empty className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-gray-100 dark:bg-gray-800">
          <Snowflake />
        </EmptyMedia>
        <EmptyTitle>Compiling results...</EmptyTitle>
        <EmptyDescription>Your insights will appear shortly.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
