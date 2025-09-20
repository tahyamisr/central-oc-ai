
"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessagesProps {
  messages: Message[];
  isPending: boolean;
}

export function ChatMessages({ messages, isPending }: ChatMessagesProps) {
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({
        top: scrollViewportRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <ScrollArea className="h-full" viewportRef={scrollViewportRef}>
      <div className="p-4 md:p-6 space-y-6 pb-24">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start gap-4 justify-end"
            )}
          >
            {message.role === "assistant" && (
              <Avatar className="h-8 w-8 shrink-0 order-last">
                <AvatarImage src="https://www.dropbox.com/scl/fi/2ypsrr8n9lj9daty5sq5x/Central-OC.png?rlkey=9ujc2o9sj96vfrgofbqllt6ni&raw=1" alt="Bot"/>
                <AvatarFallback className="bg-primary/20">
                  <Bot className="h-5 w-5 text-primary" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "max-w-[85%] rounded-lg p-3 text-sm shadow-sm text-right",
                message.role === "user"
                  ? "bg-accent text-accent-foreground"
                  : "bg-card text-card-foreground"
              )}
            >
              {message.role === "assistant" ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="prose-styles"
                  components={{
                    p: ({ node, ...props }) => <p className="font-body text-base" {...props} />,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                <p className="font-body text-base">{message.content}</p>
              )}
            </div>
            {message.role === "user" && (
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isPending && (
          <div className="flex items-start gap-4 justify-end">
            <Avatar className="h-8 w-8 shrink-0 order-last">
               <AvatarImage src="https://www.dropbox.com/scl/fi/2ypsrr8n9lj9daty5sq5x/Central-OC.png?rlkey=9ujc2o9sj96vfrgofbqllt6ni&raw=1" alt="Bot"/>
              <AvatarFallback className="bg-primary/20">
                <Bot className="h-5 w-5 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="max-w-[75%] rounded-lg p-3 text-sm bg-card text-card-foreground flex items-center shadow-sm">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
