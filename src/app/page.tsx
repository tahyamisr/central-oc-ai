import { ChatInterface } from "@/components/chat/chat-interface";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground">
        <div className="container flex h-20 items-center justify-center">
          <div className="flex items-center gap-4">
            <Image
              src="https://www.dropbox.com/scl/fi/2ypsrr8n9lj9daty5sq5x/Central-OC.png?rlkey=9ujc2o9sj96vfrgofbqllt6ni&raw=1"
              alt="شعار اللجنة المركزية للتنظيم والمراسم"
              width={50}
              height={50}
              className="object-contain"
            />
            <span className="font-bold text-2xl">
              اللجنة المركزية للتنظيم
            </span>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
        <ChatInterface />
      </main>
      <footer className="w-full p-4 text-center">
        <p className="text-red-600 font-bold">لجنة التنظيم المركزية - اتحاد طلاب تحيا مصر</p>
      </footer>
    </div>
  );
}
