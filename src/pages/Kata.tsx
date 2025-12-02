import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolSelector } from "@/components/ToolSelector";
import { processPrompt } from "@/api/client";

type Tool = "getLastWeekLeaderboard" | "getLastWeekTransactions" | "getTodayLeaderboard";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [selectedTools, setSelectedTools] = useState<Set<Tool>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string>("");

  const tools: Tool[] = [
    "getLastWeekLeaderboard",
    "getLastWeekTransactions",
    "getTodayLeaderboard",
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

  const handleSelectAll = () => {
    const allSelected = tools.every((tool) => selectedTools.has(tool));
    if (allSelected) {
      setSelectedTools(new Set());
    } else {
      setSelectedTools(new Set(tools));
    }
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
        <nav className="mb-4">
          <Link to="/" className="text-sm hover:text-foreground">
            ← Back to Landing
          </Link>
        </nav>
        <main>
          <Card>
            <CardHeader>
              <CardTitle>
                <h1 className="text-2xl">Apogee Prompting Kata</h1>
              </CardTitle>
              <CardDescription>
                <p className="text-black">
                  Enter your prompt and select the tools you want to execute
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="prompt"
                  className="text-sm font-medium"
                  id="prompt-label"
                >
                  Main prompt input (required)
                </label>
                <Textarea
                  id="prompt"
                  placeholder="Type your detailed request for the AI, e.g., 'Summarize last week’s leaderboard and explain any major changes.'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-32 resize-y"
                  required
                />
              </div>

              <ToolSelector
                tools={tools}
                selectedTools={selectedTools}
                onToggleTool={toggleTool}
                onSelectAll={handleSelectAll}
              />

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
                  <p className="text-sm whitespace-pre-wrap">
                    {response}
                    {loading && <span className="animate-pulse">▊</span>}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
