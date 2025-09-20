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
import { cn } from "@/lib/utils";
import Image from "next/image";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "أهلاً بك! أنا المساعد الذكي للجنة المركزية. كيف يمكنني مساعدتك اليوم؟",
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
          title: "خطأ",
          description: result.error,
        });
        // Remove the user message if AI fails
        setMessages((prev) => prev.slice(0, -1));
      }
    });
  };

  const hasUserMessages = messages.some((m) => m.role === "user");

  if (!hasUserMessages) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-3xl text-center">
         <Image
            src="https://www.dropbox.com/scl/fi/2ypsrr8n9lj9daty5sq5x/Central-OC.png?rlkey=9ujc2o9sj96vfrgofbqllt6ni&raw=1"
            alt="شعار اللجنة المركزية للتنظيم والمراسم"
            width={240}
            height={80}
            className="object-contain mb-4"
            priority
          />
        <p className="text-muted-foreground mb-8 text-lg">
          أهلاً بك! أنا المساعد الذكي للجنة المركزية. كيف يمكنني مساعدتك اليوم؟
        </p>
        <div className="w-full">
          <ChatInput onSendMessage={handleSendMessage} isPending={isPending} />
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-3xl h-[75vh] flex flex-col shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-headline">المساعد الذكي</CardTitle>
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
