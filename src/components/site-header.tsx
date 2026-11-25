"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOOLS } from "@/lib/tools";

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/75 backdrop-blur-lg dark:border-zinc-800/70 dark:bg-zinc-950/75">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 text-lg shadow-md shadow-pink-500/30 transition group-hover:rotate-12">
            🧰
          </span>
          <span className="text-lg font-black tracking-tight">
            POYO
            <span className="ml-1 hidden font-semibold text-zinc-500 sm:inline">小工具箱</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {TOOLS.map((tool) => {
            const active = pathname === tool.href;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                }`}
              >
                <span>{tool.emoji}</span>
                <span className="hidden sm:inline">{tool.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
