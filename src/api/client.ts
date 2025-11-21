const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export interface ProcessRequest {
  tools: string[];
  prompt: string;
}

export interface StreamChunk {
  chunk?: string;
  done?: boolean;
  error?: string;
}

export const processPrompt = async function* (
  data: ProcessRequest
): AsyncGenerator<string, void, unknown> {
  const response = await fetch(`${API_BASE_URL}/api/process`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tools: data.tools.join(","),
      prompt: data.prompt,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body reader available");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const json = JSON.parse(line.slice(6)) as StreamChunk;
          if (json.error) {
            throw new Error(json.error);
          }
          if (json.done) {
            return;
          }
          if (json.chunk) {
            yield json.chunk;
          }
        } catch (e) {
          if (e instanceof SyntaxError) {
            // Skip malformed JSON
            continue;
          }
          throw e;
        }
      }
    }
  }
};

