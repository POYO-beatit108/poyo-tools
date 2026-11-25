import type { Metadata } from "next";
import LotteryWheel from "./lottery-wheel";

export const metadata: Metadata = {
  title: "抽獎轉盤 | POYO-TOOLS",
  description: "輸入名單，轉動轉盤隨機抽出得獎者",
};

export default function LotteryPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">🎡 抽獎轉盤</h1>
      <p className="mb-8 text-zinc-500">
        在左邊輸入名單（一行一個），按下「開始抽獎」轉動轉盤。
      </p>
      <LotteryWheel />
    </main>
  );
}
