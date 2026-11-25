"use client";

import { useMemo, useState } from "react";

const COLORS = [
  "#f87171",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#2dd4bf",
  "#60a5fa",
  "#a78bfa",
  "#f472b6",
];

const SPIN_MS = 5000;
const SIZE = 400;
const C = SIZE / 2;
const R = C - 6;

const DEFAULT_NAMES = ["小明", "小華", "小美", "阿強", "小芳", "阿傑"].join("\n");

function point(angleDeg: number, radius: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: C + radius * Math.sin(a), y: C - radius * Math.cos(a) };
}

function slicePath(start: number, end: number) {
  const p1 = point(start, R);
  const p2 = point(end, R);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${C} ${C} L ${p1.x} ${p1.y} A ${R} ${R} 0 ${largeArc} 1 ${p2.x} ${p2.y} Z`;
}

function sliceColor(i: number, total: number) {
  // Avoid the first and last slice sharing a color.
  if (total > 1 && i === total - 1 && i % COLORS.length === 0) {
    return COLORS[1];
  }
  return COLORS[i % COLORS.length];
}

function truncate(name: string, max: number) {
  return name.length > max ? name.slice(0, max - 1) + "…" : name;
}

export default function LotteryWheel() {
  const [input, setInput] = useState(DEFAULT_NAMES);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [removeWinner, setRemoveWinner] = useState(false);

  const names = useMemo(
    () =>
      input
        .split("\n")
        .map((n) => n.trim())
        .filter(Boolean),
    [input],
  );

  const seg = names.length > 0 ? 360 / names.length : 360;
  const maxChars = names.length > 16 ? 5 : names.length > 8 ? 7 : 10;
  const fontSize = names.length > 16 ? 12 : names.length > 8 ? 15 : 18;

  function spin() {
    if (spinning || names.length < 2) return;
    const index = Math.floor(Math.random() * names.length);
    // A slice's center sits under the top pointer when the wheel is
    // rotated by -(center angle), modulo 360.
    const jitter = (Math.random() - 0.5) * seg * 0.7;
    const targetMod = (((360 - (index + 0.5) * seg - jitter) % 360) + 360) % 360;
    const currentMod = ((rotation % 360) + 360) % 360;
    const delta = ((targetMod - currentMod + 360) % 360) + 360 * 6;

    setWinner(null);
    setPendingIndex(index);
    setSpinning(true);
    setRotation(rotation + delta);
  }

  function handleSpinEnd() {
    if (!spinning || pendingIndex === null) return;
    const name = names[pendingIndex];
    setSpinning(false);
    setPendingIndex(null);
    setWinner(name);
    setHistory((h) => [name, ...h]);
    if (removeWinner) {
      const lines = input.split("\n");
      let count = -1;
      const next = lines.filter((line) => {
        if (!line.trim()) return true;
        count += 1;
        return count !== pendingIndex;
      });
      setInput(next.join("\n"));
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      {/* 名單輸入 */}
      <section className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="font-semibold">
            抽獎名單 <span className="text-sm text-zinc-500">（共 {names.length} 人）</span>
          </span>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setWinner(null);
            }}
            disabled={spinning}
            rows={14}
            placeholder={"一行輸入一個名字\n例如：\n小明\n小華"}
            className="w-full resize-y rounded-lg border border-zinc-300 bg-white p-3 text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={removeWinner}
            onChange={(e) => setRemoveWinner(e.target.checked)}
            disabled={spinning}
            className="h-4 w-4"
          />
          抽中後從名單移除
        </label>

        <button
          type="button"
          onClick={() => {
            setInput("");
            setWinner(null);
          }}
          disabled={spinning || !input}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          清空名單
        </button>

        {history.length > 0 && (
          <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold">抽獎紀錄</span>
              <button
                type="button"
                onClick={() => setHistory([])}
                disabled={spinning}
                className="text-xs text-zinc-500 hover:underline"
              >
                清除
              </button>
            </div>
            <ol className="max-h-48 space-y-1 overflow-y-auto text-sm">
              {history.map((n, i) => (
                <li key={`${n}-${history.length - i}`}>
                  <span className="text-zinc-500">#{history.length - i}</span> {n}
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      {/* 轉盤 */}
      <section className="flex flex-col items-center gap-6">
        <div className="relative w-full max-w-[420px]">
          {/* 指針 */}
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1">
            <div className="h-0 w-0 border-x-[16px] border-t-[28px] border-x-transparent border-t-red-600 drop-shadow" />
          </div>

          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="w-full drop-shadow-xl"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? `transform ${SPIN_MS}ms cubic-bezier(0.15, 0.85, 0.25, 1)`
                : "none",
            }}
            onTransitionEnd={handleSpinEnd}
          >
            <circle cx={C} cy={C} r={R + 4} fill="#27272a" />
            {names.length === 0 ? (
              <circle cx={C} cy={C} r={R} fill="#e4e4e7" />
            ) : names.length === 1 ? (
              <circle cx={C} cy={C} r={R} fill={COLORS[0]} />
            ) : (
              names.map((name, i) => (
                <path
                  key={i}
                  d={slicePath(i * seg, (i + 1) * seg)}
                  fill={sliceColor(i, names.length)}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))
            )}
            {names.map((name, i) => {
              const mid = names.length === 1 ? 0 : (i + 0.5) * seg;
              const tx = C;
              const ty = C - R * 0.6;
              return (
                <g key={`t-${i}`} transform={`rotate(${mid} ${C} ${C})`}>
                  <text
                    x={tx}
                    y={ty}
                    transform={`rotate(90 ${tx} ${ty})`}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={fontSize}
                    fontWeight={700}
                    fill="#18181b"
                  >
                    {truncate(name, maxChars)}
                  </text>
                </g>
              );
            })}
            <circle cx={C} cy={C} r={22} fill="#fff" stroke="#27272a" strokeWidth={4} />
          </svg>
        </div>

        <button
          type="button"
          onClick={spin}
          disabled={spinning || names.length < 2}
          className="rounded-full bg-red-600 px-10 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {spinning ? "抽獎中…" : "開始抽獎"}
        </button>

        {names.length < 2 && !spinning && (
          <p className="text-sm text-zinc-500">請至少輸入 2 個名字才能抽獎</p>
        )}

        <div className="min-h-[72px] text-center" aria-live="polite">
          {winner && (
            <div className="rounded-xl bg-amber-100 px-8 py-4 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100">
              <div className="text-sm">🎉 恭喜得獎者 🎉</div>
              <div className="text-3xl font-bold">{winner}</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
