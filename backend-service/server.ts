import express, { Request, Response } from "express";
import { main } from "./lib/openai/app.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

interface ProcessRequestBody {
  tools?: string;
  prompt?: string;
}

app.post("/api/process", async (req: Request<{}, {}, ProcessRequestBody>, res: Response) => {
  try {
    const { tools, prompt } = req.body;

    if (!tools || !prompt) {
      return res.status(400).json({
        error: "Missing required fields: 'tools' and 'prompt' are required"
      });
    }

    const result = await main(tools, prompt);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("Error processing request:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      error: "Internal server error",
      message: errorMessage
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

