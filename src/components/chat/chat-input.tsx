"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type React from "react";
import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  content: z.string().min(1, "لا يمكن أن تكون الرسالة فارغة."),
});

type FormValues = z.infer<typeof formSchema>;

export interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isPending: boolean;
  isInitial: boolean;
}

export function ChatInput({ onSendMessage, isPending, isInitial }: ChatInputProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
    mode: "onChange",
  });

  const { isValid } = form.formState;

  const ensureVisible = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  useEffect(() => {
    if (isInitial) {
      ensureVisible();
    }
  }, [isInitial]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onSendMessage(data.content);
    form.reset();
  };


  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      if (isValid) {
        event.preventDefault();
        form.handleSubmit(onSubmit)();
      }
    } else {
      ensureVisible();
    }
  };


  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center w-full gap-2"
      >
        <Button
          type="submit"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-md"
          disabled={isPending || !isValid}
          aria-label="إرسال"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <div className="relative">
                  <Textarea
                    placeholder="اسأل عن أي شئ..."
                    className="resize-none w-full border-input border bg-card rounded-md px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-right"
                    {...field}
                    onKeyDown={handleKeyDown}
                    onFocus={ensureVisible}
                    onClick={ensureVisible}
                    disabled={isPending}
                    rows={1}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-right"/>
            </FormItem>
          )}
        />
        
      </form>
    </Form>
  );
}
