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
async function* callModelToComposeMessage(
  prompt: string,
  toolResults: ToolResults,
  client: OpenAIClientInterface = openAIClient
): AsyncGenerator<string, void, unknown> {
  const params: ChatCompletionCreateParams = {
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: "Compose a human-readable message using the provided tool data, suitable for posting in Slack."
      },
      {
        role: "user",
        content: prompt
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
export async function* main(prompt: string): AsyncGenerator<string, void, unknown> {
  console.log("🔹 Input del usuario:", prompt);
  const toolResults: ToolResults = {
    getLastWeekLeaderboard: await getLastWeekLeaderboard(),
    getLastWeekTransactions: await getLastWeekTransactions(),
    getTodayLeaderboard: await getTodayLeaderboard(),
  };

  yield* callModelToComposeMessage(prompt, toolResults);
}

