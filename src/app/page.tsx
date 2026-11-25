import Link from "next/link";
import { TOOLS } from "@/lib/tools";

const HIGHLIGHTS = [
  { emoji: "⚡", title: "打開就能用", text: "不用下載、不用註冊，點進頁面馬上開始。" },
  { emoji: "🔒", title: "資料留在你身邊", text: "名單與設定只在你的瀏覽器裡運作，不會上傳。" },
  { emoji: "📱", title: "手機電腦都好用", text: "響應式設計，在任何螢幕上都清楚好操作。" },
];

export default function Home() {
  return (
    <main className="flex-1 overflow-hidden">
      {/* Hero */}
      <section className="relative isolate">
        {/* 背景裝飾 */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-pink-400/30 blur-3xl dark:bg-pink-600/20" />
          <div className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-orange-300/40 blur-3xl dark:bg-orange-500/20" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-400/30 blur-3xl dark:bg-violet-600/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.07)_1px,transparent_0)] [background-size:24px_24px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_0)]" />
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-20 sm:py-28 lg:grid-cols-[1.1fr_1fr]">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-zinc-600 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              {TOOLS.length} 款工具，免費使用
            </span>

            <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight sm:text-6xl">
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-violet-500 bg-clip-text text-transparent">
                POYO
              </span>
              <br />
              小工具箱
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 lg:mx-0 dark:text-zinc-400">
              抽獎、專注、問運勢——生活中的小需求，交給 POYO 一鍵搞定。
              簡單、可愛、打開就能用。
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
              <a
                href="#tools"
                className="rounded-full bg-zinc-900 px-8 py-3.5 font-semibold text-white shadow-lg shadow-zinc-900/20 transition hover:-translate-y-0.5 hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                探索工具 ↓
              </a>
              <Link
                href="/fortune"
                className="rounded-full border border-zinc-300 bg-white/70 px-8 py-3.5 font-semibold backdrop-blur transition hover:-translate-y-0.5 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/70"
              >
                ⛩️ 先抽支籤
              </Link>
            </div>
          </div>

          {/* 浮動工具卡片 */}
          <div aria-hidden className="relative mx-auto hidden h-80 w-full max-w-md sm:block">
            {TOOLS.map((tool, i) => (
              <div
                key={tool.href}
                className={`absolute flex w-56 items-center gap-3 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-xl backdrop-blur dark:border-zinc-700/60 dark:bg-zinc-900/80 ${
                  ["left-0 top-0 -rotate-6", "right-0 top-24 rotate-3", "bottom-0 left-10 -rotate-2"][i]
                }`}
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient} text-2xl shadow-md`}
                >
                  {tool.emoji}
                </span>
                <div>
                  <div className="font-bold">{tool.name}</div>
                  <div className="text-xs text-zinc-500">{tool.tagline}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 工具介紹 */}
      <section id="tools" className="scroll-mt-20 bg-zinc-50 py-20 dark:bg-zinc-900/40">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">挑一個工具開始吧</h2>
            <p className="mt-3 text-zinc-500">每一款都經過精心設計，好看又好用</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${tool.gradient}`}
                />
                <div
                  className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${tool.gradient} opacity-10 blur-2xl transition group-hover:opacity-30`}
                />

                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient} text-3xl shadow-lg transition duration-300 group-hover:rotate-6 group-hover:scale-110`}
                >
                  {tool.emoji}
                </span>

                <h3 className="mt-6 text-2xl font-bold">{tool.name}</h3>
                <p className="mt-1 text-sm font-medium text-zinc-500">{tool.tagline}</p>
                <p className="mt-4 leading-relaxed text-zinc-600 dark:text-zinc-400">{tool.description}</p>

                <ul className="mt-5 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {tool.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 text-green-500">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <span className="mt-8 inline-flex items-center gap-1 font-semibold">
                  立即使用
                  <span className="transition group-hover:translate-x-1">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 特色 */}
      <section className="py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 sm:grid-cols-3">
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} className="rounded-2xl p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-2xl dark:bg-zinc-800">
                {h.emoji}
              </div>
              <h3 className="mt-4 text-lg font-bold">{h.title}</h3>
              <p className="mt-2 text-sm text-zinc-500">{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20">
        <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-pink-500 to-violet-600 px-6 py-14 text-center text-white shadow-2xl">
          <div aria-hidden className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/20 blur-2xl" />
          <div aria-hidden className="absolute -bottom-16 -right-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <h2 className="relative text-3xl font-black sm:text-4xl">今天想從哪裡開始？</h2>
          <p className="relative mt-3 text-white/80">選一個工具，讓今天更有效率、更有趣。</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-full bg-white/15 px-6 py-3 font-semibold ring-1 ring-white/40 backdrop-blur transition hover:bg-white hover:text-zinc-900"
              >
                {tool.emoji} {tool.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
