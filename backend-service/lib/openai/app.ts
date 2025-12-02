/*
* Ah Ah Ah, you didn't say the magic word! Don't touch this file unless you know what you are doing.
*/
import lastWeekLeaderboard from "../../mocks/lastWeekLeaderboard.json";
import lastWeekTransactions from "../../mocks/lastWeekTransactions.json";
import todayLeaderboard from "../../mocks/todayLeaderboard.json";
import { openAIClient, type OpenAIClientInterface } from "./client.js";
import type { ChatCompletionCreateParams } from "openai/resources/chat/completions";

interface Leaderboard {
  name: string;
  total: number;
  rank: number;
}

interface Transaction {
  message: string;
  amount: number;
  timestamp: string;
  newTotal: number;
  fromName: string;
  toName: string;
}
// Types
interface UserInput {
  tools: string;
  prompt: string;
}

interface ToolCall {
  toolName: string;
  args: Record<string, unknown>;
}

interface ToolResults {
  getLastWeekLeaderboard?: Leaderboard[];
  getLastWeekTransactions?: Transaction[];
  getTodayLeaderboard?: Leaderboard[];
}


// ---- Mock DB functions ---------------------
async function getLastWeekLeaderboard(): Promise<Leaderboard[]> {
  return lastWeekLeaderboard as Leaderboard[];
}

async function getLastWeekTransactions(): Promise<Transaction[]> {
  return lastWeekTransactions as Transaction[];
}

async function getTodayLeaderboard(): Promise<Leaderboard[]> {
  return todayLeaderboard as Leaderboard[];
}
// --------------------------------------------

async function callModelWithTools(
  userInput: UserInput,
  client: OpenAIClientInterface = openAIClient
): Promise<ToolCall[] | null> {
  const params: ChatCompletionCreateParams = {
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: "You are an assistant that decides which tools to call based on user input."
      },
      {
        role: "user",
        content: JSON.stringify(userInput)
      }
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "getLastWeekLeaderboard",
          description: "Get the leaderboard for the last week",
          parameters: {
            type: "object",
            properties: {},
            required: []
          }
        }
      },
      {
        type: "function",
        function: {
          name: "getLastWeekTransactions",
          description: "Get all transactions from the last week",
          parameters: {
            type: "object",
            properties: {},
            required: []
          }
        }
      },
      {
        type: "function",
        function: {
          name: "getTodayLeaderboard",
          description: "Get the leaderboard for today",
          parameters: {
            type: "object",
            properties: {},
            required: []
          }
        }
      }
    ]
  };

  // For tool selection, we need to collect the full response, so we'll use streaming but collect it
  const stream = await client.createChatCompletion(params);
  let fullMessage = "";
  let toolCalls: ToolCall[] | null = null;

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta;
    if (delta?.tool_calls) {
      // Collect tool calls from stream
      for (const toolCall of delta.tool_calls) {
        if (toolCall.type === "function" && toolCall.function?.name) {
          const toolName = toolCall.function.name;
          const existingCall = toolCalls?.find(tc => tc.toolName === toolName);
          if (!existingCall) {
            if (!toolCalls) toolCalls = [];
            toolCalls.push({
              toolName: toolName,
              args: toolCall.function.arguments ? JSON.parse(toolCall.function.arguments) : {}
            });
          }
        }
      }
    }
    if (delta?.content) {
      fullMessage += delta.content;
    }
  }

  // If we got tool calls, return them; otherwise check if we got a message
  if (toolCalls && toolCalls.length > 0) {
    return toolCalls;
  }

  return null;
}

async function* callModelToComposeMessage(
  userInput: UserInput,
  toolResults: ToolResults,
  client: OpenAIClientInterface = openAIClient
): AsyncGenerator<string, void, unknown> {
  const params: ChatCompletionCreateParams = {
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: "Compose a human-readable message using the provided tool data."
      },
      {
        role: "user",
        content: JSON.stringify(userInput)
      },
      {
        role: "system",
        content: "Here are the results from the tools: " + JSON.stringify(toolResults, null, 2)
      }
    ]
  };

  const stream = await client.createChatCompletion(params);
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}

// ---- MAIN FUNCTION ------------------------
export async function* main(tools: string, prompt: string): AsyncGenerator<string, void, unknown> {
  const input: UserInput = {
    tools,
    prompt
  };

  console.log("🔹 Input del usuario:", input);

  // 1. First OpenAI call → ask model which tools to use
  const toolCalls = await callModelWithTools(input);

  if (!toolCalls) {
    throw new Error("No tools were selected by the model");
  }

  console.log("\n🔧 Herramientas seleccionadas por el modelo:");

  // 2. Execute the tools
  const toolResults: ToolResults = {};
  for (const call of toolCalls) {
    if (call.toolName === "getLastWeekLeaderboard") {
      toolResults.getLastWeekLeaderboard = await getLastWeekLeaderboard();
    }
    if (call.toolName === "getLastWeekTransactions") {
      toolResults.getLastWeekTransactions = await getLastWeekTransactions();
    }
    if (call.toolName === "getTodayLeaderboard") {
      toolResults.getTodayLeaderboard = await getTodayLeaderboard();
    }
  }

  // 3. Second call → compose final message (streaming)
  yield* callModelToComposeMessage(input, toolResults);
}

