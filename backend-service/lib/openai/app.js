import "dotenv/config";
import OpenAI from "openai";

// ---- Fake DB functions ---------------------
async function getLeaderboard() {
  return [
    { user: "Alice", amount: 120 },
    { user: "Bob", amount: 90 },
    { user: "Charlie", amount: 50 },
  ];
}

async function getTopGivers() {
  return [
    { user: "Alice", given: 100 },
    { user: "Charlie", given: 80 },
  ];
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
          name: "leaderboard",
          description: "Get the leaderboard for the current period",
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
          name: "topGivers",
          description: "Get top givers in the system",
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
    if (call.toolName === "leaderboard") {
      toolResults.leaderboard = await getLeaderboard();
    }
    if (call.toolName === "topGivers") {
      toolResults.topGivers = await getTopGivers();
    }
  }

  console.log("\n📊 Resultados de las tools:", toolResults);

  // 3. Second call → compose final message
  const finalMessage = await callModelToComposeMessage(input, toolResults);

  console.log("\n💬 Mensaje generado por el modelo:\n");
  console.log(finalMessage);

  return finalMessage;
}

