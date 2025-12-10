import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
type Tool = "getLastWeekLeaderboard" | "getLastWeekTransactions" | "getTodayLeaderboard";

interface ToolSelectorProps {
  tools: Tool[];
}

const toolInfo: Record<Tool, { label: string; description: string }> = {
  getLastWeekLeaderboard: {
    label: "Get Last Week Leaderboard",
    description: "Retrieves the leaderboard snapshot from 7 days ago.",
  },
  getLastWeekTransactions: {
    label: "Get Last Week Transactions",
    description: "Returns all transactions (points given or taken) from the last 7 days. Includes messages, amounts, timestamps, and who gave/received points.",
  },
  getTodayLeaderboard: {
    label: "Get Today Leaderboard",
    description: "Shows the current leaderboard as of today.",
  },
};

export function ToolSelector({ tools }: ToolSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Available Tools</p>
      </div>
      <div className="space-y-3">
        {tools.map((toolId) => {
          const info = toolInfo[toolId];
          return (
            <TooltipProvider key={toolId}>
              <div className="flex items-center gap-2 group">
                <p
                  id={`info-${toolId}`}
                  className="text-sm font-medium leading-none"
                >
                  {info.label}
                </p>
                <Tooltip aria-hidden="true">
                  <TooltipTrigger asChild>
                    <span
                      className="ml-2 text-foreground opacity-100 transition-opacity"
                    >
                      <Info className="h-4 w-4" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm">
                    <p>{info.description}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}

