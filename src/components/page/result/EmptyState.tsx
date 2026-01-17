import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Snowflake } from "lucide-react";
export function EmptyState(){
    return (
        <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Snowflake />
          </EmptyMedia>
          <EmptyTitle>Compiling results...</EmptyTitle>
          <EmptyDescription>
            Your insights will appear shortly.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
}