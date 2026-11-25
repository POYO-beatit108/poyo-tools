import type { Metadata } from "next";
import PomodoroTimer from "./pomodoro-timer";

export const metadata: Metadata = {
  title: "番茄鐘 | POYO-TOOLS",
  description: "番茄工作法計時器，幫助你專注工作、適時休息",
};

export default function PomodoroPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">🍅 番茄鐘</h1>
      <p className="mb-8 text-zinc-500">
        專注一段時間，再短暫休息；每完成 4 個番茄，來一次長休息。
      </p>
      <PomodoroTimer />
    </main>
  );
}
