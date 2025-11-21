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

interface MainResult {
  message: string;
  toolResults: ToolResults;
  toolsUsed: string[];
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

  const response = await client.createChatCompletion(params);
  const choice = response.choices[0];

  if (choice.finish_reason === "tool_calls" && choice.message.tool_calls) {
    return choice.message.tool_calls
      .filter((call): call is Extract<typeof call, { type: "function" }> => call.type === "function")
      .map(call => ({
        toolName: call.function.name,
        args: call.function.arguments ? JSON.parse(call.function.arguments) : {}
      }));
  }

  return null;
}

async function callModelToComposeMessage(
  userInput: UserInput,
  toolResults: ToolResults,
  client: OpenAIClientInterface = openAIClient
): Promise<string> {
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

  const response = await client.createChatCompletion(params);
  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No content in response");
  }
  return content;
}

// ---- MAIN FUNCTION ------------------------
export async function main(tools: string, prompt: string): Promise<MainResult> {
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

  console.log("\n🔧 Herramientas seleccionadas por el modelo:", toolCalls);

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

  console.log("\n📊 Resultados de las tools:", toolResults);

  // 3. Second call → compose final message
  const finalMessage = await callModelToComposeMessage(input, toolResults);

  // Return as JSON
  return {
    message: finalMessage,
    toolResults: toolResults,
    toolsUsed: toolCalls.map(call => call.toolName)
  };
}

