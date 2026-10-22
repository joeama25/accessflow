import { Delete } from "lucide-react";

export function KeyPad({ onDigit, onDelete, isLarge, isHighContrast }) {
  const keyClass = `flex items-center justify-center rounded-2xl border font-bold transition-all ${
    isLarge ? "py-8 text-3xl" : "py-4 text-xl"
  } ${
    isHighContrast
      ? "bg-black border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
      : "bg-gray-50 border-gray-200 text-gray-900 active:bg-gray-100 shadow-sm"
  }`;

  return (
    <div className={`grid grid-cols-3 gap-3 ${isLarge ? "gap-4" : ""}`}>
      {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
        <button
          key={d}
          type="button"
          data-no-speak
          aria-label={`Number ${d}`}
          onClick={() => onDigit(d)}
          className={keyClass}
        >
          {d}
        </button>
      ))}
      <span aria-hidden="true" />
      <button
        type="button"
        data-no-speak
        aria-label="Number 0"
        onClick={() => onDigit("0")}
        className={keyClass}
      >
        0
      </button>
      <button
        type="button"
        data-no-speak
        aria-label="Delete"
        onClick={onDelete}
        className={keyClass}
      >
        <Delete className={isLarge ? "h-8 w-8" : "h-6 w-6"} />
      </button>
    </div>
  );
}

JSON.parse(localStorage.getItem('accessflow_settings_1234'))