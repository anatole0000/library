// src/resolvers/aiAssistant.ts
import { askLibraryAssistant } from "../utils/aiAssistant";

export const aiAssistantResolver = {
  Query: {
    askAI: async (_: any, { question }: { question: string }) => {
      console.log("⚙️ Đã nhận câu hỏi:", question);
      const answer = await askLibraryAssistant(question);
      console.log("🧠 Trả lời:", answer);
      return answer;
    },
  },
};
