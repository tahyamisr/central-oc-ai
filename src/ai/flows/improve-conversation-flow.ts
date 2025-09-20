'use server';

/**
 * @fileOverview Implements a Genkit flow to improve conversation flow by remembering previous turns.
 *
 * - improveConversationFlow - A function that enhances conversation flow by maintaining context.
 * - ImproveConversationFlowInput - The input type for the improveConversationFlow function, including user message and conversation history.
 * - ImproveConversationFlowOutput - The return type for the improveConversationFlow function, containing the AI's response.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveConversationFlowInputSchema = z.object({
  userMessage: z.string().describe('The latest message from the user.'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The history of the conversation as an array of objects with role and content.'),
});

export type ImproveConversationFlowInput = z.infer<typeof ImproveConversationFlowInputSchema>;

const ImproveConversationFlowOutputSchema = z.object({
  aiResponse: z.string().describe('The AI generated response to the user message, considering the conversation history.'),
});

export type ImproveConversationFlowOutput = z.infer<typeof ImproveConversationFlowOutputSchema>;

export async function improveConversationFlow(input: ImproveConversationFlowInput): Promise<ImproveConversationFlowOutput> {
  return improveConversationFlowFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveConversationFlowPrompt',
  input: { schema: ImproveConversationFlowInputSchema },
  output: { schema: ImproveConversationFlowOutputSchema },
  prompt: `أنت مساعد ذكاء اصطناعي مفيد وودود تتحدث باللهجة المصرية. تجري محادثة مع مستخدم.

  {% if conversationHistory %}
  هذا هو سجل المحادثة:
  {{#each conversationHistory}}
  {{role}}: {{content}}
  {{/each}}
  {% endif %}

  رسالة المستخدم: {{{userMessage}}}

  يرجى تقديم رد يواصل المحادثة بشكل طبيعي، مع الأخذ في الاعتبار الأدوار السابقة.`, // Handlebars here
});

const improveConversationFlowFlow = ai.defineFlow(
  {
    name: 'improveConversationFlowFlow',
    inputSchema: ImproveConversationFlowInputSchema,
    outputSchema: ImproveConversationFlowOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return {
      aiResponse: output!.aiResponse,
    };
  }
);
