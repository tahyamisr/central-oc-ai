"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { getAIResponse } from "@/app/actions";
import type { Message } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChatMessages } from "./chat-messages";
import { ChatInput, type ChatInputProps } from "./chat-input";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! How can I help you today?",
    },
  ]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSendMessage: ChatInputProps["onSendMessage"] = (content) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    startTransition(async () => {
      const history = newMessages
        .filter((m) => m.role !== "system")
        .map(({ id, ...rest }) => rest);

      const result = await getAIResponse(history.slice(0, -1), content);

      if (result.success) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
        // Remove the user message if AI fails
        setMessages((prev) => prev.slice(0, -1));
      }
    });
  };

  return (
    <Card className="w-full max-w-3xl h-[75vh] flex flex-col shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-headline">AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ChatMessages messages={messages} isPending={isPending} />
      </CardContent>
      <CardFooter className="p-4 border-t">
        <ChatInput onSendMessage={handleSendMessage} isPending={isPending} />
      </CardFooter>
    </Card>
  );
}
