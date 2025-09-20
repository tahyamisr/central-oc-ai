import { ChatInterface } from "@/components/chat/chat-interface";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <h1 className="text-xl font-bold font-headline">Chat AI</h1>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
        <ChatInterface />
      </main>
    </div>
  );
}
