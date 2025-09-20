
"use server";

import type { Message } from "@/lib/types";

const WEBHOOK_URL = "https://submit.tahyamisrsu.com/webhook/OC-AI";

export async function getAIResponse(
  history: Omit<Message, "id">[],
  userMessage: string
) {
  // The webhook expects the full history, including the latest user message.
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
      const errorBody = await response.text();
      console.error("Webhook response not OK:", response.status, response.statusText);
      console.error("Webhook error body:", errorBody);
      return {
        success: false,
        error: `عفواً، حدث خطأ أثناء التواصل مع الخادم: ${response.statusText}`,
      };
    }

    const result = await response.json();
    
    // The webhook is expected to return a JSON array like: `[{"output": "..."}]`
    if (Array.isArray(result) && result.length > 0 && typeof result[0].output === 'string') {
        return { success: true, response: result[0].output };
    } else {
        console.error("Invalid response format from webhook:", result);
        return { success: false, error: "عفواً، تم استلام رد غير صالح من الخادم. الصيغة المتوقعة: `[{\"output\": \"...\"}]`" };
    }

  } catch (error) {
    console.error("Error calling webhook:", error);
    // Check for specific fetch errors if possible, otherwise return a generic message.
    if (error instanceof TypeError) { // Often indicates a network error
        return { success: false, error: "عفواً، حدث خطأ في الشبكة. يرجى التحقق من اتصالك بالإنترنت."};
    }
    return {
      success: false,
      error: "عفواً، حدث خطأ غير متوقع. برجاء المحاولة مرة أخرى.",
    };
  }
}
