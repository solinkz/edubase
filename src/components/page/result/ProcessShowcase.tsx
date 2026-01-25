import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Square, CheckCircle2, Loader2, Sparkles, Clock } from "lucide-react";

interface ProcessShowcaseProps {
  isProcessing: boolean;
  currentStep: string;
  timeTaken: number | null;
  onStop: () => void;
}

export function ProcessShowcase({
  isProcessing,
  currentStep,
  timeTaken,
  onStop,
}: ProcessShowcaseProps) {
  return (
    <div className="flex flex-col p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg transition-all duration-300">
      <div className="flex items-center min-h-8">
        <div className="flex-1 flex items-center gap-3">
          {isProcessing ? (
            <Button
              variant="default"
              size="icon-xs"
              className="rounded-full bg-gray-900 dark:bg-gray-100 hover:bg-red-500 dark:hover:bg-red-500 transition-colors group cursor-pointer"
              onClick={onStop}
              title="Stop processing"
            >
              <Square
                size={12}
                className="fill-white dark:fill-black group-hover:fill-white"
              />
            </Button>
          ) : timeTaken ? (
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <CheckCircle2 size={16} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Sparkles size={16} />
            </div>
          )}

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {currentStep || "Ready to analyze"}
              </span>
              {isProcessing && (
                <Loader2 size={14} className="animate-spin text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {timeTaken && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-600"
          >
            <Clock size={12} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 tabular-nums">
              {timeTaken}ms
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
