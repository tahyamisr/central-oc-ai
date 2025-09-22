
"use client";

import { useState, useTransition, useEffect, useRef } from "react";
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
  "لو بتخطط لحدث هيغير مفهوم التنظيم، إزاي قسم الـ \"Planning\" بتاعنا بيحط الأساس عشان يضمن إن الخطة تكون قوية ومبتكرة ومفيش فيها غلطة؟",
  "لما الحضور يوصلوا، إزاي قسم الـ \"Registration\" بيضمن إن عملية التسجيل (سواء VIP أو عادي) تكون سريعة ومريحة وتسيب انطباع أول ممتاز؟",
  "لو في أي ظرف طارئ حصل فجأة، إزاي فريق \"Emergency Team\" بيكون مستعد وجاهز للتعامل مع الموقف بثبات وحكمة؟",
  "إيه التحديات اللي بتواجه فريق \"Floor Team\" في تنظيم القاعة أو المكان، وإزاي بيقدروا يتغلبوا عليها عشان الكل يبقى مرتاح ومبسوط؟",
  "قبل ما أي متحدث يطلع على المسرح، إزاي فريق \"Backstage Team\" بيكون هو \"الدرع الخفي\" اللي بيضمن إن كل حاجة جاهزة ومفيش أي مفاجآت؟",
  "في فعالياتنا الأونلاين، إزاي فريق التنظيم الأونلاين بيقدر يحول الشاشات دي لمنصة تفاعلية وممتعة تخلي الكل مركز ومستفيد؟",
];

const LoadingDots = () => (
  <div className="flex items-center justify-center gap-1">
    <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse-dot-1"></span>
    <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse-dot-2"></span>
    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse-dot-3"></span>
  </div>
);

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const suggestionIndexRef = useRef(0);
  const [userId, setUserId] = useState<string | null>(null);


  useEffect(() => {
    setIsMounted(true);
    let storedUserId = localStorage.getItem('chat_userId');
    if (!storedUserId) {
      storedUserId = crypto.randomUUID();
      localStorage.setItem('chat_userId', storedUserId);
    }
    setUserId(storedUserId);
    suggestionIndexRef.current = Math.floor(Math.random() * suggestionQuestions.length);
  }, []);

  const handleSendMessage = (content: string) => {
    if (!content.trim() || !userId) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    startTransition(async () => {
      const historyForAI = newMessages.map(({ id, ...rest }) => rest);

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
        setMessages((prev) => prev.slice(0, -1));
      }
    });
  };

  const handleSuggestion = async () => {
    setIsSuggestionLoading(true);
    setInput(""); 
    await new Promise(resolve => setTimeout(resolve, 500)); 

    const randomQuestion = suggestionQuestions[suggestionIndexRef.current];
    suggestionIndexRef.current = (suggestionIndexRef.current + 1) % suggestionQuestions.length;
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < randomQuestion.length) {
        setInput(prev => prev + randomQuestion[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsSuggestionLoading(false);
      }
    }, 50);
  };

  const hasUserMessages = messages.some((m) => m.role === "user");

  const renderInitialView = () => (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl text-center h-full">
      <div className="flex flex-col items-center justify-center flex-grow">
          <Image
            src="https://www.dropbox.com/scl/fi/2ypsrr8n9lj9daty5sq5x/Central-OC.png?rlkey=9ujc2o9sj96vfrgofbqllt6ni&raw=1"
            alt="شعار اتحاد طلاب تحيا مصر"
            width={100}
            height={100}
            className="object-contain mb-6"
          />
          <h1 className="text-4xl font-bold mb-4">أهلاً وسهلاً بحضرتك</h1>
          <p className="text-foreground text-lg max-w-md mb-8">
            موقعي اساعدك بكل ما يتعلق باللجنة المركزية للتنظيم
          </p>
          <div className="w-full px-4 md:px-0">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isPending={isPending || !isMounted} 
              isInitial={true} 
              value={input}
              onValueChange={setInput}
            />
          </div>
       </div>
    </div>
  );

  const renderChatView = () => (
     <Card className="w-full max-w-2xl h-full flex flex-col shadow-none border-none bg-transparent">
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
         <Button onClick={handleSuggestion} variant="outline" className="mt-2" disabled={isPending || !isMounted || isSuggestionLoading}>
            {isSuggestionLoading ? <LoadingDots /> : "اقترح سؤال ✨"}
        </Button>
      </CardFooter>
    </Card>
  );

  return hasUserMessages ? renderChatView() : renderInitialView();
}
