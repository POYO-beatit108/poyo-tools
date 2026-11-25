"use client";

import { useEffect, useState } from "react";

type Mode = "focus" | "short" | "long";

type Settings = {
  focus: number;
  short: number;
  long: number;
  longEvery: number;
  autoStart: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  focus: 25,
  short: 5,
  long: 15,
  longEvery: 4,
  autoStart: false,
};

const MODE_INFO: Record<Mode, { label: string; color: string; bg: string }> = {
  focus: { label: "專注", color: "#dc2626", bg: "bg-red-600 hover:bg-red-700" },
  short: { label: "短休息", color: "#16a34a", bg: "bg-green-600 hover:bg-green-700" },
  long: { label: "長休息", color: "#2563eb", bg: "bg-blue-600 hover:bg-blue-700" },
};

const RING = 140;
const CIRC = 2 * Math.PI * RING;

function minutesOf(mode: Mode, s: Settings) {
  return mode === "focus" ? s.focus : mode === "short" ? s.short : s.long;
}

function format(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function playChime() {
  try {
    const ctx = new AudioContext();
    [0, 0.35, 0.7].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + offset + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.32);
    });
    setTimeout(() => ctx.close(), 1500);
  } catch {
    // Audio not available; ignore.
  }
}

function notify(body: string) {
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    new Notification("POYO 番茄鐘", { body });
  }
}

export default function PomodoroTimer() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(DEFAULT_SETTINGS.focus * 60_000);
  const [endAt, setEndAt] = useState<number | null>(null);
  const [completed, setCompleted] = useState(0);
  const [task, setTask] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const running = endAt !== null;
  const totalMs = minutesOf(mode, settings) * 60_000;
  const progress = totalMs > 0 ? Math.min(1, Math.max(0, 1 - remaining / totalMs)) : 0;
  const info = MODE_INFO[mode];

  // Tick while running; based on an end timestamp so it stays accurate
  // even when the tab is in the background.
  useEffect(() => {
    if (endAt === null) return;
    const id = setInterval(() => {
      const left = endAt - Date.now();
      if (left > 0) {
        setRemaining(left);
        return;
      }

      playChime();
      let next: Mode;
      if (mode === "focus") {
        const done = completed + 1;
        setCompleted(done);
        next = done % settings.longEvery === 0 ? "long" : "short";
        notify(`完成一個番茄！休息一下吧（${MODE_INFO[next].label}）`);
      } else {
        next = "focus";
        notify("休息結束，開始專注吧！");
      }
      const nextMs = minutesOf(next, settings) * 60_000;
      setMode(next);
      setRemaining(nextMs);
      setEndAt(settings.autoStart ? Date.now() + nextMs : null);
    }, 250);
    return () => clearInterval(id);
  }, [endAt, mode, completed, settings]);

  // Show the countdown in the browser tab title.
  useEffect(() => {
    const original = "番茄鐘 | POYO-TOOLS";
    document.title = running ? `${format(remaining)} ${info.label} | POYO-TOOLS` : original;
    return () => {
      document.title = original;
    };
  }, [running, remaining, info.label]);

  function switchMode(next: Mode) {
    setMode(next);
    setEndAt(null);
    setRemaining(minutesOf(next, settings) * 60_000);
  }

  function toggle() {
    if (endAt !== null) {
      setRemaining(Math.max(0, endAt - Date.now()));
      setEndAt(null);
    } else {
      if (typeof Notification !== "undefined" && Notification.permission === "default") {
        Notification.requestPermission();
      }
      setEndAt(Date.now() + remaining);
    }
  }

  function reset() {
    setEndAt(null);
    setRemaining(totalMs);
  }

  function skip() {
    // Move to the next session without counting a skipped focus as done.
    switchMode(mode === "focus" ? "short" : "focus");
  }

  function updateSetting(key: "focus" | "short" | "long" | "longEvery", value: number) {
    const v = Math.max(1, Math.min(key === "longEvery" ? 12 : 180, Math.round(value) || 1));
    const nextSettings = { ...settings, [key]: v };
    setSettings(nextSettings);
    if (!running && key === mode) {
      setRemaining(v * 60_000);
    }
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* 模式切換 */}
      <div className="flex gap-2 rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
        {(Object.keys(MODE_INFO) as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => switchMode(m)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              mode === m
                ? "bg-white text-zinc-900 shadow dark:bg-zinc-950 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {MODE_INFO[m].label}
          </button>
        ))}
      </div>

      {/* 倒數圓環 */}
      <div className="relative w-full max-w-[340px]">
        <svg viewBox="0 0 320 320" className="w-full -rotate-90">
          <circle cx={160} cy={160} r={RING} fill="none" stroke="currentColor" strokeWidth={14} className="text-zinc-200 dark:text-zinc-800" />
          <circle
            cx={160}
            cy={160}
            r={RING}
            fill="none"
            stroke={info.color}
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - progress)}
            style={{ transition: "stroke-dashoffset 0.25s linear, stroke 0.3s" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-semibold" style={{ color: info.color }}>
            {info.label}
          </span>
          <span className="font-mono text-6xl font-bold tabular-nums">{format(remaining)}</span>
          {task && mode === "focus" && (
            <span className="mt-2 max-w-[200px] truncate text-sm text-zinc-500">{task}</span>
          )}
        </div>
      </div>

      {/* 控制按鈕 */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-zinc-300 px-5 py-3 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          重設
        </button>
        <button
          type="button"
          onClick={toggle}
          className={`min-w-[140px] rounded-full px-10 py-3 text-lg font-bold text-white shadow-lg transition active:scale-95 ${info.bg}`}
        >
          {running ? "暫停" : remaining < totalMs ? "繼續" : "開始"}
        </button>
        <button
          type="button"
          onClick={skip}
          className="rounded-full border border-zinc-300 px-5 py-3 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          跳過
        </button>
      </div>

      {/* 目前任務 */}
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="現在要專注在什麼事情上？"
        className="w-full max-w-md rounded-lg border border-zinc-300 bg-white px-4 py-2 text-center text-zinc-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      />

      {/* 今日進度 */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-wrap justify-center gap-1 text-2xl">
          {Array.from({ length: Math.max(settings.longEvery, completed) }, (_, i) => (
            <span key={i} className={i < completed ? "" : "opacity-20 grayscale"}>
              🍅
            </span>
          ))}
        </div>
        <span className="text-sm text-zinc-500">
          已完成 {completed} 個番茄・共專注 {completed * settings.focus} 分鐘
          {completed > 0 && (
            <button
              type="button"
              onClick={() => setCompleted(0)}
              className="ml-2 text-xs hover:underline"
            >
              歸零
            </button>
          )}
        </span>
      </div>

      {/* 設定 */}
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={() => setShowSettings((v) => !v)}
          className="mx-auto block text-sm text-zinc-500 hover:underline"
        >
          ⚙️ {showSettings ? "收起設定" : "時間設定"}
        </button>
        {showSettings && (
          <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            {(
              [
                ["focus", "專注（分鐘）"],
                ["short", "短休息（分鐘）"],
                ["long", "長休息（分鐘）"],
                ["longEvery", "幾個番茄後長休息"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex flex-col gap-1 text-sm">
                {label}
                <input
                  type="number"
                  min={1}
                  value={settings[key]}
                  onChange={(e) => updateSetting(key, Number(e.target.value))}
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                />
              </label>
            ))}
            <label className="col-span-2 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.autoStart}
                onChange={(e) => setSettings({ ...settings, autoStart: e.target.checked })}
                className="h-4 w-4"
              />
              時間到自動開始下一段
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
