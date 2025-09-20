"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type React from "react";
import { useRef } from "react";

const formSchema = z.object({
  content: z.string().min(1, "Message cannot be empty."),
});

type FormValues = z.infer<typeof formSchema>;

export interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isPending: boolean;
}

export function ChatInput({ onSendMessage, isPending }: ChatInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onSendMessage(data.content);
    form.reset();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  const handleFocus = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300); // Delay to allow keyboard to appear
  };


  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-start w-full gap-4"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Textarea
                  placeholder="Type your message... (Ctrl+Enter to send)"
                  rows={1}
                  className="resize-none min-h-[40px]"
                  {...field}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="icon"
          className="h-10 w-10 shrink-0"
          disabled={isPending}
          aria-label="Send message"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <SendHorizontal className="h-5 w-5" />
          )}
        </Button>
      </form>
    </Form>
  );
}
