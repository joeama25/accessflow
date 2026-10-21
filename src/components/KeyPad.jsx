import { Delete } from "lucide-react";

export function KeyPad({ onDigit, onDelete, isLarge }) {
  const keyClass = `flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--muted)] font-bold text-[var(--foreground)] active:bg-[var(--accent)] transition-all ${
    isLarge ? "py-8 text-3xl" : "py-4 text-xl"
  }`;
  
  return (
    <div className={`grid grid-cols-3 gap-3 ${isLarge ? "gap-4" : ""}`}>
      {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
        <button key={d} type="button" onClick={() => onDigit(d)} className={keyClass}>
          {d}
        </button>
      ))}
      <span aria-hidden="true" />
      <button type="button" onClick={() => onDigit("0")} className={keyClass}>0</button>
      <button type="button" aria-label="Delete" onClick={onDelete} className={keyClass}>
        <Delete className={isLarge ? "h-8 w-8" : "h-6 w-6"} />
      </button>
    </div>
  );
}