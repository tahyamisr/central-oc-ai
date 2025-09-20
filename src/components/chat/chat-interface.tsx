"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { getAIResponse } from "@/app/actions";
import type { Message } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import Image from "next/image";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "أهلاً بك! أنا المساعد الذكي. كيف يمكنني مساعدتك اليوم؟",
    },
  ]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSendMessage = (content: string) => {
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
        setMessages((prev) => prev.slice(0, -1));
      }
    });
  };

  const hasUserMessages = messages.some((m) => m.role === "user");

  if (!hasUserMessages) {
    return (
      <div className="flex flex-col items-center justify-between w-full max-w-2xl text-center h-full">
         <div className="flex-grow flex flex-col items-center justify-center">
            <Image
              src="https://www.dropbox.com/scl/fi/2ypsrr8n9lj9daty5sq5x/Central-OC.png?rlkey=9ujc2o9sj96vfrgofbqllt6ni&raw=1"
              alt="شعار اتحاد طلاب تحيا مصر"
              width={80}
              height={80}
              className="object-contain mb-6"
            />
            <h1 className="text-2xl font-bold mb-2">أهلاً وسهلاً بحضرتك</h1>
            <p className="text-foreground text-sm max-w-md mb-8">
              موقعي اساعدك بكل ما يتعلق باللجنة المركزية للتنظيم
            </p>
         </div>
        <div className="w-full sticky bottom-0 py-4">
          <ChatInput onSendMessage={handleSendMessage} isPending={isPending} isInitial={true} />
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl h-[75vh] flex flex-col shadow-none border-none bg-transparent">
      <CardContent className="flex-1 overflow-hidden p-0">
        <ChatMessages messages={messages} isPending={isPending} />
      </CardContent>
      <CardFooter className="p-0 pt-4 border-t-0">
        <ChatInput onSendMessage={handleSendMessage} isPending={isPending} isInitial={false}/>
      </CardFooter>
    </Card>
  );
}
