import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

type Tool = "getLastWeekLeaderboard" | "getLastWeekTransactions" | "getTodayLeaderboard";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [selectedTools, setSelectedTools] = useState<Set<Tool>>(new Set());

  const tools: { id: Tool; label: string }[] = [
    { id: "getLastWeekLeaderboard", label: "Get Last Week Leaderboard" },
    { id: "getLastWeekTransactions", label: "Get Last Week Transactions" },
    { id: "getTodayLeaderboard", label: "Get Today Leaderboard" },
  ];

  const toggleTool = (toolId: Tool) => {
    setSelectedTools((prev) => {
      const next = new Set(prev);
      if (next.has(toolId)) {
        next.delete(toolId);
      } else {
        next.add(toolId);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    console.log("Prompt:", prompt);
    console.log("Selected tools:", Array.from(selectedTools));
    // TODO: Implement API call to backend
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Apogee Prompting Kata</CardTitle>
            <CardDescription>
              Enter your prompt and select the tools you want to execute
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-medium">
                Prompt
              </label>
              <Textarea
                id="prompt"
                placeholder="Enter your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32 resize-y"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Select Tools</label>
              <div className="space-y-3">
                {tools.map((tool) => (
                  <div key={tool.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={tool.id}
                      checked={selectedTools.has(tool.id)}
                      onCheckedChange={() => toggleTool(tool.id)}
                    />
                    <label
                      htmlFor={tool.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {tool.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim() || selectedTools.size === 0}
              className="w-full"
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
