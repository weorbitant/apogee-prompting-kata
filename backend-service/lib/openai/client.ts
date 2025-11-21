import "dotenv/config";
import OpenAI from "openai";
import type { ChatCompletionCreateParams, ChatCompletion } from "openai/resources/chat/completions";

export interface OpenAIClientInterface {
  createChatCompletion(params: ChatCompletionCreateParams): Promise<ChatCompletion>;
}

export class OpenAIClient implements OpenAIClientInterface {
  private client: OpenAI;

  constructor(apiKey?: string) {
    this.client = new OpenAI({ apiKey: apiKey || process.env.OPENAI_API_KEY });
  }

  async createChatCompletion(params: ChatCompletionCreateParams): Promise<ChatCompletion> {
    const result = await this.client.chat.completions.create({
      ...params,
      stream: false
    });
    return result as ChatCompletion;
  }
}

// Export a singleton instance for use in the app
export const openAIClient = new OpenAIClient();

