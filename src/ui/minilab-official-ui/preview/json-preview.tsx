import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "../utils/cn";

export function JsonPreview({ value, className }: { value: unknown; className?: string }) {
  const [copied, setCopied] = useState(false);
  const text = JSON.stringify(value, null, 2);
  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          } catch {
            /* no-op */
          }
        }}
        className="absolute top-2 right-2 h-6 w-6 grid place-items-center rounded text-neutral-500 hover:text-neutral-100 hover:bg-white/[0.06]"
        aria-label="Copy JSON"
      >
        {copied ? <Check size={12} strokeWidth={1.5} /> : <Copy size={12} strokeWidth={1.5} />}
      </button>
      <pre className="p-3 pr-9 rounded-md border border-white/10 bg-black/30 text-[10.5px] text-neutral-300 font-mono leading-relaxed overflow-x-auto scrollbar-thin">
        <code>{text}</code>
      </pre>
    </div>
  );
}
