import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Square } from "lucide-react";

export function ProcessShowcase() {
  const [showProcess, setShowProcess] = useState(false);

  return (
    <div className="flex flex-col p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex items-center">
        <div className="flex-1 flex items-center gap-2">
          <Button variant="default" size="icon-xs" className="rounded-full">
            <Square />
          </Button>
          <span className="text-sm">Identifying data needed...</span>
        </div>
        <Button
          variant="ghost"
          size="xs"
          className="cursor-pointer"
          onClick={() => {
            setShowProcess(!showProcess);
          }}
        >
          {showProcess ? "Collapse" : "Expand"}{" "}
          <motion.div
            animate={{ rotate: showProcess ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            <ChevronDown />
          </motion.div>
        </Button>
      </div>
      <AnimatePresence>
        {showProcess && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t dark:border-gray-600 flex flex-col pt-4 px-4 pb-4 gap-4 mt-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                What I need to do:
              </h3>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      1.
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Identify the data needed
                    </span>
                  </div>
                  <ul className="pl-6 flex flex-col gap-1">
                    <li className="text-sm text-gray-500 dark:text-gray-400 list-disc">
                      Member list for company KK22
                    </li>
                    <li className="text-sm text-gray-500 dark:text-gray-400 list-disc">
                      Recent admissions within the last 24 hours
                    </li>
                    <li className="text-sm text-gray-500 dark:text-gray-400 list-disc">
                      Admission details (reason, facility, status, cost)
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      2.
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Filter and retrieve relevant records:
                    </span>
                  </div>
                  <ul className="pl-6 flex flex-col gap-1">
                    <li className="text-sm text-gray-500 dark:text-gray-400 list-disc">
                      Match company = 'KK22'
                    </li>
                    <li className="text-sm text-gray-400 dark:text-gray-500 list-disc">
                      Filter by admission_timestamp in the last 24 hours
                    </li>
                    <li className="text-sm text-gray-400 dark:text-gray-500 list-disc">
                      Sort newest first
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
