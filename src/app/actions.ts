"use server";

import { improveConversationFlow } from "@/ai/flows/improve-conversation-flow";
import type { Message } from "@/lib/types";

export async function getAIResponse(
  history: Omit<Message, "id">[],
  userMessage: string
) {
  try {
    const result = await improveConversationFlow({
      conversationHistory: history,
      userMessage: userMessage,
    });
    return { success: true, response: result.aiResponse };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Sorry, I encountered an error. Please try again.",
    };
  }
}
