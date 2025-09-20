
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
import { Button } from "@/components/ui/button";

const suggestionQuestions = [
  "إزاي نخلي أي فعالية تبقى ذكرى حلوة مش حدث عادي؟",
  "التكنولوجيا تساعدنا إزاي نخلي التنظيم أسرع وأجمد؟",
  "لو بتستقبل شخصية مهمة، إزاي تخلي الاستقبال مثالي؟",
  "لو طابور التسجيل طويل، تتصرف إزاي تمنع الزحمة؟",
  "في فعالية أونلاين، إزاي تضمن إن المنصة والشبكة جاهزين؟",
  "أول مرة تنظم حدث كبير، إيه أول 3 خطوات تبدأ بيهم؟",
  "إيه السر ورا الدعوات الشيك، التسجيل السريع، والشهادات الأونلاين؟",
  "في التحضير لفعالية ضخمة، إزاي بنقسم الشغل بينا؟",
  "كل نائب ليه دور مميز (زي ريم، أحمد حسن، وحنين) — إزاي شايف ده؟",
  "إيه أنواع التنظيم اللي بنشتغل فيها: أوفلاين ولا أونلاين؟",
  "إيه أهم الصفات أو المهارات اللي لازم تكون عند عضو التنظيم؟",
  "إيه أهم الخدمات الرقمية اللي بتسهّل شغلنا؟",
  "مين رئيس ونائب محافظتي للتنظيم؟",
  "مين الهيكل المركزي للتنظيم.",
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
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
    if (!content.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    startTransition(async () => {
      // Pass the entire message history to the action, but strip out the IDs
      const historyForAI = newMessages
        .filter(m => m.role === 'user' || m.role === 'assistant')
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

  const handleSuggestion = () => {
    const randomQuestion = suggestionQuestions[Math.floor(Math.random() * suggestionQuestions.length)];
    setInput(randomQuestion);
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
        <div className="flex items-center gap-2">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isPending={isPending || !isMounted} 
              isInitial={true} 
              value={input}
              onValueChange={setInput}
            />
        </div>
        <Button onClick={handleSuggestion} variant="outline" className="mt-2" disabled={isPending || !isMounted}>
            ✨ اقترح
        </Button>
      </div>
    </div>
  );

  const renderChatView = () => (
     <Card className="w-full max-w-2xl h-[75vh] flex flex-col shadow-none border-none bg-transparent">
      <CardContent className="flex-1 overflow-hidden p-0">
          <ChatMessages messages={messages} isPending={isPending} />
      </CardContent>
      <CardFooter className="p-0 pt-4 border-t-0 flex-col items-stretch">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isPending={isPending || !isMounted} 
          isInitial={false}
          value={input}
          onValueChange={setInput}
        />
         <Button onClick={handleSuggestion} variant="outline" className="mt-2" disabled={isPending || !isMounted}>
            ✨ اقترح
        </Button>
      </CardFooter>
    </Card>
  );

  return hasUserMessages ? renderChatView() : renderInitialView();
}
