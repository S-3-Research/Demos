"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export type MatchPosition = "original" | "option2" | "option3" | "option4";

export function MatchPositionSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = (searchParams.get("match_pos") ?? "original") as MatchPosition;

  const set = (pos: MatchPosition) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("match_pos", pos);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const tabs: { key: MatchPosition; label: string }[] = [
    { key: "original", label: "Default (top center)" },
    { key: "option2", label: "Option 2 (Chat Header)" },
    { key: "option3", label: "Option 3 (FAB)" },
    { key: "option4", label: "Option 4 (Global Header)" },
  ];

  return (
    <div className="flex items-center gap-3 px-4 py-2 border-b border-slate-200/60 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm shrink-0">
      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 hidden sm:block whitespace-nowrap">
        👀 Match position:
      </span>
      <div className="flex gap-1.5">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => set(key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              current === key
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700/60 dark:text-slate-400 dark:hover:bg-slate-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
