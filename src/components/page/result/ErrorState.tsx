import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  solution?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an error while processing your request.",
  solution = "Please try again later or contact support if the issue persists.",
}: ErrorStateProps) {
  return (
    <div className="w-full flex-1 flex items-center justify-center p-6">
      <Empty className="max-w-md">
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className="bg-red-50 dark:bg-red-900/20 text-red-500"
          >
            <AlertCircle />
          </EmptyMedia>
          <EmptyTitle className="text-red-600 dark:text-red-400">
            {title}
          </EmptyTitle>
          <EmptyDescription className="text-gray-600 dark:text-gray-300">
            <span className="mb-2 hidden">{message}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {solution}
            </span>
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
