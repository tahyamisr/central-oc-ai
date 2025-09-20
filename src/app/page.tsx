import { ChatInterface } from "@/components/chat/chat-interface";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/50">
      <header className="sticky top-0 z-50 w-full bg-accent text-accent-foreground border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <span className="font-bold text-xl">
              لجنة التنظيم والمراسم المركزية
            </span>
          </div>
          <Image
            src="https://www.dropbox.com/scl/fi/2ypsrr8n9lj9daty5sq5x/Central-OC.png?rlkey=9ujc2o9sj96vfrgofbqllt6ni&raw=1"
            alt="شعار اتحاد طلاب تحيا مصر"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
        <ChatInterface />
      </main>
      <footer className="w-full p-4 text-center bg-background">
        <p className="text-sm text-muted-foreground font-bold">تنفيذ لجنة التنظيم المركزية - اتحاد طلاب تحيا مصر</p>
      </footer>
    </div>
  );
}
