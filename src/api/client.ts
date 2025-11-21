import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ProcessRequest {
  tools: string[];
  prompt: string;
}

export interface ProcessResponse {
  success: boolean;
  message: string;
  toolResults: {
    getLastWeekLeaderboard?: unknown[];
    getLastWeekTransactions?: unknown[];
    getTodayLeaderboard?: unknown[];
  };
  toolsUsed: string[];
}

export const processPrompt = async (
  data: ProcessRequest
): Promise<ProcessResponse> => {
  const response = await apiClient.post<ProcessResponse>("/api/process", {
    tools: data.tools.join(","),
    prompt: data.prompt,
  });
  return response.data;
};

