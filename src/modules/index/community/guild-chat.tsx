"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const initial = [
  {
    text: "[System] Welcome to <WOWNILLA>. Guild message of the day: gm raiders.",
    guild: false,
  },
  { text: "[Guild] [Moonpaw]: gm gm", guild: true },
  {
    text: "[Guild] [Sir_Grindalot]: just hit level 60 in holding",
    guild: true,
  },
  { text: "[Guild] [Pepeladin]: anyone LFG for the moon raid?", guild: true },
  { text: "Pepeladin rolls 100 (1-100)", guild: false },
  { text: "[Guild] [Healbot9000]: not healing anyone who sells", guild: true },
  {
    text: "[System] Moonpaw has earned the achievement ",
    guild: false,
    achievement: "Diamond Paws",
  },
];
const upcoming = [
  { text: "[Guild] [Moonpaw]: wen lambo mount", guild: true },
  { text: "Sir_Grindalot has come online.", guild: false },
  {
    text: "[Guild] [Tankzilla]: pulling the chart, everyone stack",
    guild: true,
  },
  { text: "[Guild] [Healbot9000]: OOM, someone post a meme", guild: true },
  { text: "Tankzilla rolls 1 (1-100)", guild: false },
  {
    text: "[Guild] [Pepeladin]: bought the dip. then bought the dip of the dip",
    guild: true,
  },
  {
    text: "[System] Healbot9000 has earned the achievement ",
    guild: false,
    achievement: "Never Sell",
  },
  { text: "[Guild] [Sir_Grindalot]: /flex", guild: true },
  {
    text: "[Guild] [Moonpaw]: this website is way too nice for a meme lol",
    guild: true,
  },
];

/** Maintains a bounded stream of fictional guild messages without injecting HTML. */
export function GuildChat() {
  const [lines, setLines] = useState(() =>
    initial.map((line, id) => ({ ...line, id })),
  );
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    let index = 0;
    const timer = setInterval(() => {
      if (document.hidden) return;
      const next = {
        ...upcoming[index % upcoming.length],
        id: initial.length + index++,
      };
      setLines((previous) => [...previous, next].slice(-9));
    }, 3200);
    return () => clearInterval(timer);
  }, [reduced]);
  return (
    <div
      id="chat"
      className="h-[320px] md:h-[360px] overflow-hidden px-3 py-4 flex flex-col justify-end gap-1.5 font-narrow text-[14px] leading-relaxed [text-shadow:0_1px_1px_#000]"
    >
      {lines.map((line) => (
        <p
          key={line.id}
          className={`chat-line ${line.guild ? "c-guild" : "c-sys"}`}
        >
          {line.text}
          {line.achievement ? (
            <>
              <span className="c-leg">[{line.achievement}]</span>!
            </>
          ) : null}
        </p>
      ))}
    </div>
  );
}
