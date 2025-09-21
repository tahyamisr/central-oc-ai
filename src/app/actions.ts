
"use server";

import type { Message } from "@/lib/types";

export async function getAIResponse(
  history: Message[],
  userMessage: string
) {
  try {
    const response = await fetch("https://submit.tahyamisrsu.com/webhook/OC-AI", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMessage: userMessage,
        conversationHistory: history,
      }),
    });

    if (!response.ok) {
      console.error("Webhook response was not ok:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      return { success: false, error: "عفواً، حدث خطأ أثناء الاتصال بالخادم." };
    }

    const aiResponse = await response.json();

    if (aiResponse && aiResponse.aiResponse) {
      return { success: true, response: aiResponse.aiResponse };
    } else {
      console.error("Invalid response format from webhook:", aiResponse);
      return { success: false, error: "عفواً، تم استلام رد غير صالح من الخادم." };
    }
  } catch (error) {
    console.error("Error calling webhook:", error);
    return {
      success: false,
      error: "عفواً، حدث خطأ غير متوقع. برجاء المحاولة مرة أخرى.",
    };
  }
}
