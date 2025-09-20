
"use client";

import { useState, useTransition, useEffect } from "react";
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    let storedUserId = localStorage.getItem('chat_userId');
    if (!storedUserId) {
      storedUserId = crypto.randomUUID();
      localStorage.setItem('chat_userId', storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  const handleSendMessage = (content: string) => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "لم يتم تحديد هوية المستخدم. يرجى تحديث الصفحة والمحاولة مرة أخرى.",
      });
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    startTransition(async () => {
      // Pass the entire message history to the action, but strip out the IDs
      const historyForAI = newMessages
        .map(({ id, ...rest }) => rest);

      const result = await getAIResponse(historyForAI, content, userId);

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
        // If the API call fails, remove the user's message from the UI
        setMessages((prev) => prev.slice(0, -1));
      }
    });
  };

  const hasUserMessages = messages.some((m) => m.role === "user");

  const renderInitialView = () => (
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
        <ChatInput onSendMessage={handleSendMessage} isPending={isPending || !isMounted} isInitial={true} />
      </div>
    </div>
  );

  const renderChatView = () => (
     <Card className="w-full max-w-2xl h-[75vh] flex flex-col shadow-none border-none bg-transparent">
      <CardContent className="flex-1 overflow-hidden p-0">
        {!hasUserMessages ? (
           <div className="flex flex-col items-center justify-center h-full text-center">
              <Image
                src="https://www.dropbox.com/scl/fi/2ypsrr8n9lj9daty5sq5x/Central-OC.png?rlkey=9ujc2o9sj96vfrgofbqllt6ni&raw=1"
                alt="شعار اتحاد طلاب تحيا مصر"
                width={80}
                height={80}
                className="object-contain mb-6"
              />
              <h1 className="text-2xl font-bold mb-2">أهلاً وسهلاً بحضرتك</h1>
              <p className="text-foreground text-sm max-w-md">
                موقعي اساعدك بكل ما يتعلق باللجنة المركزية للتنظيم
              </p>
           </div>
        ) : (
          <ChatMessages messages={messages} isPending={isPending} />
        )}
      </CardContent>
      <CardFooter className="p-0 pt-4 border-t-0">
        <ChatInput onSendMessage={handleSendMessage} isPending={isPending || !isMounted} isInitial={false}/>
      </CardFooter>
    </Card>
  );

  return hasUserMessages ? renderChatView() : renderInitialView();
}
