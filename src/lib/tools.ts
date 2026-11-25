export type Tool = {
  href: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  features: string[];
  /** Tailwind gradient classes for the card accent. */
  gradient: string;
};

export const TOOLS: Tool[] = [
  {
    href: "/lottery",
    name: "抽獎轉盤",
    emoji: "🎡",
    tagline: "公平、刺激的隨機抽獎",
    description: "輸入名單，轉動繽紛轉盤，讓指針替你決定幸運兒。活動抽獎、決定誰請客都適用。",
    features: ["一行一個名字，快速建立名單", "抽中後可自動移除", "保留每次的抽獎紀錄"],
    gradient: "from-pink-500 via-rose-500 to-orange-400",
  },
  {
    href: "/pomodoro",
    name: "番茄鐘",
    emoji: "🍅",
    tagline: "專注工作，適時休息",
    description: "用番茄工作法安排節奏：25 分鐘專注、5 分鐘休息，每 4 輪來一次長休息。",
    features: ["專注／短休息／長休息自動切換", "時間到有提示音與通知", "可自訂各時段長度"],
    gradient: "from-red-500 via-orange-500 to-amber-400",
  },
  {
    href: "/fortune",
    name: "好運抽籤",
    emoji: "⛩️",
    tagline: "搖一搖，看看今日運勢",
    description: "從大吉到大凶隨機抽一支籤，附上工作、愛情、財運、健康運勢與幸運小物。",
    features: ["七種籤等，大吉大凶最稀有", "四大面向運勢星等", "幸運色、數字、方位"],
    gradient: "from-violet-500 via-purple-500 to-fuchsia-400",
  },
];
