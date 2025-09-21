
"use server";

import { improveConversationFlow } from "@/ai/flows/improve-conversation-flow";
import type { Message } from "@/lib/types";

export async function getAIResponse(
  history: Message[],
  userMessage: string
) {
  try {
    const aiResponse = await improveConversationFlow({
      userMessage: userMessage,
      conversationHistory: history,
    });

    if (aiResponse && aiResponse.aiResponse) {
      return { success: true, response: aiResponse.aiResponse };
    } else {
      console.error("Invalid response format from AI flow:", aiResponse);
      return { success: false, error: "عفواً، تم استلام رد غير صالح من الخادم." };
    }
  } catch (error) {
    console.error("Error calling AI flow:", error);
    return {
      success: false,
      error: "عفواً، حدث خطأ غير متوقع. برجاء المحاولة مرة أخرى.",
    };
  }
}
