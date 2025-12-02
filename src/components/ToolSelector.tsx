import { Checkbox } from "@/components/ui/checkbox";
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
  selectedTools: Set<Tool>;
  onToggleTool: (toolId: Tool) => void;
  onSelectAll?: () => void;
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

export function ToolSelector({ tools, selectedTools, onToggleTool, onSelectAll }: ToolSelectorProps) {
  const allSelected = tools.length > 0 && tools.every((tool) => selectedTools.has(tool));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Select Tools</p>
      </div>
      <div className="space-y-3">
        {onSelectAll && (
          <div className="flex items-start space-x-3">
            <Checkbox
              id="select-all"
              checked={allSelected}
              onCheckedChange={onSelectAll}
              className="mt-0.5"
            />
            <label
              htmlFor="select-all"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
            >
              Select All
            </label>
          </div>
        )}
        {tools.map((toolId) => {
          const info = toolInfo[toolId];
          return (
            <TooltipProvider key={toolId}>
              <div className="flex items-start space-x-3 group">
                <Checkbox
                  id={toolId}
                  checked={selectedTools.has(toolId)}
                  onCheckedChange={() => onToggleTool(toolId)}
                  className="mt-0.5"
                  aria-labelledby={`info-${toolId}`}
                />
                <div className="flex items-center gap-2">
                  <label
                    id={`info-${toolId}`}
                    htmlFor={toolId}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                  >
                    {info.label}
                  </label>
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
              </div>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}

