
"use server";

import type { Message } from "@/lib/types";

const WEBHOOK_URL = "https://submit.tahyamisrsu.com/webhook/OC-AI";

export async function getAIResponse(
  history: Omit<Message, "id">[],
  userMessage: string
) {
  const payload = {
    conversationHistory: history,
    userMessage: userMessage,
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Webhook response not OK:", response.status, response.statusText);
      const errorBody = await response.text();
      console.error("Webhook error body:", errorBody);
      return {
        success: false,
        error: `عفواً، حدث خطأ أثناء التواصل مع الخادم: ${response.statusText}`,
      };
    }

    const result = await response.json();
    
    if (result && result.aiResponse) {
        return { success: true, response: result.aiResponse };
    } else {
        console.error("Invalid response format from webhook:", result);
        return { success: false, error: "عفواً، تم استلام رد غير صالح من الخادم." };
    }

  } catch (error) {
    console.error("Error calling webhook:", error);
    return {
      success: false,
      error: "عفواً، حدث خطأ. برجاء المحاولة مرة أخرى.",
    };
  }
}
