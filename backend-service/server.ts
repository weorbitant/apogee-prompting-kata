/*
* Ah Ah Ah, you didn't say the magic word! Don't touch this file unless you know what you are doing.
*/
import express, { Request, Response } from "express";
import cors from "cors";
import { main } from "./lib/openai/app.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
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

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      for await (const chunk of main(tools, prompt)) {
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error in streaming:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
      res.end();
    }
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

