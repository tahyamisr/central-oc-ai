
"use server";

import { improveConversationFlow } from "@/ai/flows/improve-conversation-flow";
import type { Message } from "@/lib/types";

export async function getAIResponse(
  history: Omit<Message, "id">[],
  userMessage: string
) {
  try {
    const aiResponse = await improveConversationFlow({
        userMessage: userMessage,
        conversationHistory: history.map(h => ({
            role: h.role === 'assistant' ? 'assistant' : 'user',
            content: h.content,
        })),
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
