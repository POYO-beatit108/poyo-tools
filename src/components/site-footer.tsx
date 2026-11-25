import Link from "next/link";
import { TOOLS } from "@/lib/tools";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-[1fr_auto]">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 text-base">
              🧰
            </span>
            <span className="font-black">POYO 小工具箱</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-zinc-500">
            一組小巧、好用、打開就能用的網頁工具，讓生活多一點效率、多一點樂趣。
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold">工具</h2>
          <ul className="space-y-2 text-sm text-zinc-500">
            {TOOLS.map((tool) => (
              <li key={tool.href}>
                <Link href={tool.href} className="transition hover:text-zinc-900 dark:hover:text-white">
                  {tool.emoji} {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-200 py-4 text-center text-xs text-zinc-400 dark:border-zinc-800">
        © 2026 POYO 小工具箱・Made with 💖
      </div>
    </footer>
  );
}
