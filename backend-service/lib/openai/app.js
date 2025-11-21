import "dotenv/config";
import OpenAI from "openai";
import lastWeekLeaderboard from "../../mocks/lastWeekLeaderboard.json";
import lastWeekTransactions from "../../mocks/lastWeekTransactions.json";
import todayLeaderboard from "../../mocks/todayLeaderboard.json";

// ---- Mock DB functions ---------------------
async function getLastWeekLeaderboard() {
  return lastWeekLeaderboard;
}

async function getLastWeekTransactions() {
  return lastWeekTransactions;
}

async function getTodayLeaderboard() {
  return todayLeaderboard;
}
// --------------------------------------------

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function callModelWithTools(userInput) {
  const response = await client.chat.completions.create({
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
  });

  const choice = response.choices[0];

  if (choice.finish_reason === "tool_calls") {
    return choice.message.tool_calls.map(call => ({
      toolName: call.function.name,
      args: call.function.arguments ? JSON.parse(call.function.arguments) : {}
    }));
  }

  return null;
}

async function callModelToComposeMessage(userInput, toolResults) {
  const response = await client.chat.completions.create({
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
  });

  return response.choices[0].message.content;
}

// ---- MAIN FUNCTION ------------------------
export async function main(tools, prompt) {
  const input = {
    tools,
    prompt
  };

  console.log("🔹 Input del usuario:", input);

  // 1. First OpenAI call → ask model which tools to use
  const toolCalls = await callModelWithTools(input);

  console.log("\n🔧 Herramientas seleccionadas por el modelo:", toolCalls);

  // 2. Execute the tools
  const toolResults = {};
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

  console.log("\n💬 Mensaje generado por el modelo:\n");
  console.log(finalMessage);

  // Return as JSON
  return {
    message: finalMessage,
    toolResults: toolResults,
    toolsUsed: toolCalls.map(call => call.toolName)
  };
}

