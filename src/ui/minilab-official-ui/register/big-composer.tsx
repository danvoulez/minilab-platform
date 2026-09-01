import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "../utils/cn";

export function BigComposer({
  onPropose,
  placeholder = "Descreva em linguagem natural o que você quer registrar…",
  className,
  value,
  onChange,
  focusToken = 0,
}: {
  onPropose: (text: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  focusToken?: number;
}) {
  const [internalText, setInternalText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const text = value ?? internalText;

  useEffect(() => {
    if (focusToken > 0) textareaRef.current?.focus();
  }, [focusToken]);

  function setText(next: string) {
    if (onChange) onChange(next);
    else setInternalText(next);
  }

  function submit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onPropose(trimmed);
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-white/[0.03] p-3 space-y-2",
        "focus-within:border-blue-500/40 transition-colors",
        className
      )}
    >
      <div className="flex items-center gap-2 text-[10.5px] text-neutral-500">
        <Sparkles size={12} strokeWidth={1.5} className="text-blue-300" />
        <span>linguagem natural → candidato revisável. Nada é admitido aqui.</span>
      </div>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={placeholder}
        rows={3}
        className={cn(
          "w-full resize-none bg-transparent border-0 outline-none",
          "text-[14px] text-neutral-100 placeholder:text-neutral-600 leading-relaxed"
        )}
      />
      <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
        <div className="text-[10.5px] text-neutral-600">⌘↵ para propor</div>
        <button
          type="button"
          onClick={submit}
          disabled={!text.trim()}
          className={cn(
            "h-7 px-3 rounded-md text-[11.5px] font-medium transition-colors",
            text.trim()
              ? "bg-blue-500/20 text-blue-200 ring-1 ring-inset ring-blue-500/40 hover:bg-blue-500/30"
              : "bg-white/[0.04] text-neutral-600 ring-1 ring-inset ring-white/[0.06]"
          )}
        >
          Propor
        </button>
      </div>
    </div>
  );
}
