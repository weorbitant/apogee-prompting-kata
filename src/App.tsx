import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { processPrompt } from "@/api/client";

type Tool = "getLastWeekLeaderboard" | "getLastWeekTransactions" | "getTodayLeaderboard";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [selectedTools, setSelectedTools] = useState<Set<Tool>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string>("");

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

  const handleSubmit = async () => {
    if (!prompt.trim() || selectedTools.size === 0) {
      return;
    }

    setLoading(true);
    setError(null);
    setResponse("");

    try {
      const stream = processPrompt({
        prompt: prompt.trim(),
        tools: Array.from(selectedTools),
      });

      for await (const chunk of stream) {
        setResponse((prev) => prev + chunk);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
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
              disabled={!prompt.trim() || selectedTools.size === 0 || loading}
              className="w-full"
            >
              {loading ? "Processing..." : "Submit"}
            </Button>

            {error && (
              <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive font-medium">Error</p>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            )}

            {(response || loading) && (
              <div className="p-4 rounded-md bg-muted border">
                <p className="text-sm font-medium mb-2">Response</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {response}
                  {loading && <span className="animate-pulse">▊</span>}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
