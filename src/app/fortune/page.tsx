import type { Metadata } from "next";
import FortuneDraw from "./fortune-draw";

export const metadata: Metadata = {
  title: "好運抽籤 | POYO-TOOLS",
  description: "隨機抽一支籤，看看今天的運勢",
};

export default function FortunePage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">⛩️ 好運抽籤</h1>
      <p className="mb-8 text-zinc-500">
        心中默念想問的事，搖一搖籤筒，看看今天的運勢如何。
      </p>
      <FortuneDraw />
    </main>
  );
}
