"use client";

import { useState } from "react";

type Level = {
  name: string;
  weight: number;
  stars: number;
  tone: string; // tailwind classes for the result card
  summaries: string[];
};

const LEVELS: Level[] = [
  {
    name: "大吉",
    weight: 8,
    stars: 5,
    tone: "from-amber-300 to-red-400 text-red-950",
    summaries: [
      "萬事亨通，心想事成！今天做什麼都特別順利。",
      "好運滿滿，貴人就在身邊，放膽去做吧！",
      "天時地利人和，是實現願望的絕佳日子。",
    ],
  },
  {
    name: "中吉",
    weight: 14,
    stars: 4,
    tone: "from-orange-200 to-amber-300 text-amber-950",
    summaries: [
      "運勢上升中，努力會得到不錯的回報。",
      "好事正在發生，保持笑容會更加分。",
      "今天適合主動出擊，機會掌握在你手上。",
    ],
  },
  {
    name: "小吉",
    weight: 18,
    stars: 4,
    tone: "from-yellow-100 to-orange-200 text-orange-950",
    summaries: [
      "小確幸不斷，平凡中藏著驚喜。",
      "穩穩前進，小小的努力會累積成大大的收穫。",
      "心情愉快的一天，留意身邊的小美好。",
    ],
  },
  {
    name: "吉",
    weight: 20,
    stars: 3,
    tone: "from-lime-100 to-emerald-200 text-emerald-950",
    summaries: [
      "平順安穩，按部就班就能順利度過。",
      "沒有大起大落，是適合整理思緒的日子。",
      "保持平常心，一切都會朝好的方向發展。",
    ],
  },
  {
    name: "末吉",
    weight: 18,
    stars: 3,
    tone: "from-sky-100 to-cyan-200 text-cyan-950",
    summaries: [
      "先苦後甘，耐心等待好運會慢慢到來。",
      "起步稍慢，但後勁十足，別太早放棄。",
      "今天多觀察少衝動，晚一點會有好消息。",
    ],
  },
  {
    name: "凶",
    weight: 14,
    stars: 2,
    tone: "from-slate-200 to-indigo-200 text-indigo-950",
    summaries: [
      "今天容易有小狀況，凡事多確認一次就好。",
      "運勢稍弱，放慢腳步、謹慎行事可化險為夷。",
      "不適合做重大決定，先好好休息充電吧。",
    ],
  },
  {
    name: "大凶",
    weight: 8,
    stars: 1,
    tone: "from-zinc-300 to-purple-300 text-purple-950",
    summaries: [
      "物極必反！跌到谷底接下來只會往上，別灰心。",
      "今天低調一點，把霉運當成轉運的前奏。",
      "抽到大凶反而是難得的運氣，明天一定更好！",
    ],
  },
];

const ASPECTS: Record<string, string[][]> = {
  // index by stars - 1 (1 = 最差, 5 = 最好)
  工作: [
    ["容易出小錯，重要文件多檢查。", "先把手邊的事做完再接新任務。"],
    ["溝通容易誤會，說話放慢一點。", "進度稍慢，別給自己太大壓力。"],
    ["表現穩定，適合處理例行公事。", "和同事合作順利。"],
    ["靈感不斷，提案容易被採納。", "效率很好，可以挑戰新任務。"],
    ["能力被看見，有升遷或被讚美的機會！", "貴人相助，難題迎刃而解。"],
  ],
  愛情: [
    ["容易因小事鬧彆扭，多體諒對方。", "單身者今天先好好愛自己。"],
    ["感情需要多一點耐心與溝通。", "別把情緒帶給身邊的人。"],
    ["平淡中有溫暖，小小關心很加分。", "適合和喜歡的人聊聊天。"],
    ["桃花朵朵開，魅力大增。", "和另一半感情升溫。"],
    ["戀愛運爆棚！告白成功率超高。", "會遇到讓你心動的人。"],
  ],
  財運: [
    ["小心衝動購物，錢包要守好。", "避免借錢給別人。"],
    ["支出偏多，記帳是好主意。", "不適合投資冒險。"],
    ["收支平衡，穩穩的就好。", "可能有小額的意外之財。"],
    ["財運不錯，努力會有回報。", "適合規劃理財。"],
    ["偏財運旺！可能有意外收穫。", "錢財滾滾來，記得分享好運。"],
  ],
  健康: [
    ["注意休息，別熬夜。", "多喝水，小心著涼。"],
    ["容易疲累，記得起來動一動。", "飲食清淡一點比較好。"],
    ["身體狀況穩定，維持好習慣。", "適合散步放鬆心情。"],
    ["精神飽滿，適合運動。", "睡眠品質很好。"],
    ["活力滿點！做什麼都充滿能量。", "身心狀態都在巔峰。"],
  ],
};

const LUCKY_COLORS = ["紅色", "橘色", "金色", "黃色", "綠色", "藍色", "紫色", "粉紅色", "白色", "黑色", "米色", "天空藍"];
const LUCKY_ITEMS = ["一杯熱茶", "雨傘", "筆記本", "耳機", "零錢包", "巧克力", "綠色植物", "手錶", "香水", "一本書", "幸運手環", "便利貼"];
const LUCKY_DIRECTIONS = ["東", "南", "西", "北", "東南", "東北", "西南", "西北"];

type Result = {
  level: Level;
  number: number;
  summary: string;
  aspects: { name: string; text: string; stars: number }[];
  color: string;
  item: string;
  luckyNumber: number;
  direction: string;
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function drawLevel(): Level {
  const total = LEVELS.reduce((s, l) => s + l.weight, 0);
  let r = Math.random() * total;
  for (const level of LEVELS) {
    r -= level.weight;
    if (r < 0) return level;
  }
  return LEVELS[LEVELS.length - 1];
}

function drawFortune(): Result {
  const level = drawLevel();
  const aspects = Object.entries(ASPECTS).map(([name, byStars]) => {
    // Each aspect varies a little around the overall level.
    const stars = Math.min(5, Math.max(1, level.stars + pick([-1, 0, 0, 1])));
    return { name, stars, text: pick(byStars[stars - 1]) };
  });
  return {
    level,
    number: Math.floor(Math.random() * 100) + 1,
    summary: pick(level.summaries),
    aspects,
    color: pick(LUCKY_COLORS),
    item: pick(LUCKY_ITEMS),
    luckyNumber: Math.floor(Math.random() * 9) + 1,
    direction: pick(LUCKY_DIRECTIONS),
  };
}

const NUMBERS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

function toChineseNumber(n: number) {
  if (n === 100) return "一百";
  if (n < 10) return NUMBERS[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return `${tens === 1 ? "" : NUMBERS[tens]}十${ones ? NUMBERS[ones] : ""}`;
}

function Stars({ count }: { count: number }) {
  return (
    <span className="tracking-tight text-amber-500" aria-label={`${count} 顆星`}>
      {"★".repeat(count)}
      <span className="text-zinc-300 dark:text-zinc-600">{"★".repeat(5 - count)}</span>
    </span>
  );
}

export default function FortuneDraw() {
  const [shaking, setShaking] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  function draw() {
    if (shaking) return;
    setShaking(true);
    setResult(null);
    setTimeout(() => {
      const r = drawFortune();
      setResult(r);
      setHistory((h) => [r.level.name, ...h].slice(0, 10));
      setShaking(false);
    }, 1500);
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <style>{`
        @keyframes poyo-shake {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-14deg); }
          40% { transform: rotate(12deg); }
          60% { transform: rotate(-10deg); }
          80% { transform: rotate(8deg); }
        }
        @keyframes poyo-pop {
          0% { opacity: 0; transform: translateY(16px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* 籤筒 */}
      <button
        type="button"
        onClick={draw}
        disabled={shaking}
        aria-label="搖籤筒抽籤"
        className="group relative flex h-56 w-40 cursor-pointer items-end justify-center disabled:cursor-wait"
        style={{ animation: shaking ? "poyo-shake 0.3s ease-in-out infinite" : undefined }}
      >
        {/* 籤條 */}
        <div className="absolute top-2 flex gap-1.5">
          {[-10, -4, 2, 8, -6, 5].map((d, i) => (
            <div
              key={i}
              className="h-24 w-2.5 rounded-t-sm bg-amber-100 shadow-sm ring-1 ring-amber-300"
              style={{ transform: `rotate(${d}deg) translateY(${(i % 3) * 6}px)` }}
            />
          ))}
        </div>
        {/* 筒身 */}
        <div className="relative z-10 flex h-36 w-32 flex-col items-center justify-center rounded-b-2xl rounded-t-md bg-gradient-to-b from-red-600 to-red-800 shadow-xl ring-4 ring-amber-400 transition group-hover:scale-105">
          <span className="text-4xl font-bold text-amber-300 [writing-mode:vertical-rl]">御神籤</span>
        </div>
      </button>

      <button
        type="button"
        onClick={draw}
        disabled={shaking}
        className="rounded-full bg-red-600 px-10 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-red-700 active:scale-95 disabled:cursor-wait disabled:opacity-60"
      >
        {shaking ? "搖籤中…" : result ? "再抽一次" : "抽籤"}
      </button>

      {/* 結果 */}
      {result && (
        <div
          className="w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
          style={{ animation: "poyo-pop 0.4s ease-out" }}
          aria-live="polite"
        >
          <div className={`bg-gradient-to-br ${result.level.tone} px-6 py-6 text-center`}>
            <div className="text-sm opacity-80">第 {toChineseNumber(result.number)} 籤</div>
            <div className="my-1 text-6xl font-black tracking-widest">{result.level.name}</div>
            <p className="mt-2 font-medium">{result.summary}</p>
          </div>

          <div className="divide-y divide-zinc-100 px-6 dark:divide-zinc-800">
            {result.aspects.map((a) => (
              <div key={a.name} className="flex items-start gap-4 py-3">
                <span className="w-10 shrink-0 font-bold">{a.name}</span>
                <div className="flex-1">
                  <Stars count={a.stars} />
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{a.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 bg-zinc-50 px-6 py-4 text-sm sm:grid-cols-4 dark:bg-zinc-950">
            <Lucky label="幸運色" value={result.color} />
            <Lucky label="幸運數字" value={String(result.luckyNumber)} />
            <Lucky label="幸運物" value={result.item} />
            <Lucky label="吉方位" value={result.direction} />
          </div>
        </div>
      )}

      {history.length > 1 && (
        <div className="text-center text-sm text-zinc-500">
          最近抽到：{history.join("、")}
        </div>
      )}

      <p className="text-xs text-zinc-400">※ 抽籤結果純屬娛樂，祝你天天好運！</p>
    </div>
  );
}

function Lucky({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
