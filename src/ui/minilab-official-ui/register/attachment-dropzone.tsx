import { useState } from "react";
import { Paperclip } from "lucide-react";
import { cn } from "../utils/cn";

export function AttachmentDropzone({
  className,
  onFiles,
}: {
  className?: string;
  onFiles?: (files: File[]) => void;
}) {
  const [over, setOver] = useState(false);
  const [list, setList] = useState<string[]>([]);

  function pushFiles(files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files);
    setList((prev) => [...prev, ...arr.map((f) => f.name)]);
    onFiles?.(arr);
  }

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        pushFiles(e.dataTransfer.files);
      }}
      className={cn(
        "block rounded-md border border-dashed cursor-pointer transition-colors",
        "px-3 py-4 text-center",
        over
          ? "border-blue-500/60 bg-blue-500/[0.05]"
          : "border-white/10 bg-white/[0.02] hover:border-white/20",
        className
      )}
    >
      <input
        type="file"
        multiple
        className="hidden"
        onChange={(e) => pushFiles(e.target.files)}
      />
      <div className="flex items-center justify-center gap-2 text-[11.5px] text-neutral-400">
        <Paperclip size={12} strokeWidth={1.5} />
        <span>arraste evidências ou clique para anexar</span>
      </div>
      {list.length > 0 && (
        <div className="mt-2 text-[10.5px] text-neutral-500 truncate">
          {list.join(", ")}
        </div>
      )}
    </label>
  );
}
