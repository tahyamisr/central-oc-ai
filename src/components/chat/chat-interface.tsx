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
import { MessageSquare, Send } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

const suggestionPrompts = [
  "رؤية الاتحاد ورسالته وأهدافه",
  "المشاريع والمبادرات الكبيرة",
  "الهيكل الإداري التنظيمي المركزي",
  "وصف تفصيلي لأي لجنة مركزية",
];

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

  const SuggestionButton = ({ prompt }: { prompt: string }) => (
    <Button
      variant="outline"
      className="bg-card justify-end text-right w-full h-auto py-2 px-4"
      onClick={() => handleSendMessage(prompt)}
    >
      <span className="flex-1">{prompt}</span>
      <span className="w-2 h-2 rounded-full bg-red-500 ml-3"></span>
    </Button>
  );

  if (!hasUserMessages) {
    return (
      <div className="flex flex-col items-center justify-between w-full max-w-2xl text-center h-full">
         <div className="flex-grow flex flex-col items-center justify-center">
            <Image
              src="https://www.dropbox.com/scl/fi/2ypsrr8n9lj9daty5sq5x/Central-OC.png?rlkey=9ujc2o9sj96vfrgofbqllt6ni&raw=1"
              alt="شعار اتحاد طلاب تحيا مصر"
              width={64}
              height={64}
              className="object-contain mb-6"
            />
            <h1 className="text-2xl font-bold mb-2">أهلاً وسهلاً بحضرتك</h1>
            <p className="text-muted-foreground text-sm max-w-md mb-8">
              موقعي أساعدك في أي سؤال متعلق بالكيان الشبابي
            </p>

            <div className="w-full max-w-lg">
              <h2 className="text-lg font-bold mb-4 text-right">اقتراحات سريعة:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestionPrompts.map((prompt) => (
                  <SuggestionButton key={prompt} prompt={prompt} />
                ))}
              </div>
            </div>
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
