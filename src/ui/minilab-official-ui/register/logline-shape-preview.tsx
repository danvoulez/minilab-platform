import { cn } from "../utils/cn";

export interface LogLineShape {
  who?: string;
  did?: string;
  this?: string;
  when?: string;
  confirmed_by?: string;
  if_ok?: string;
  if_doubt?: string;
  if_not?: string;
  status?: string;
}

const SLOTS: Array<keyof LogLineShape> = [
  "who",
  "did",
  "this",
  "when",
  "confirmed_by",
  "if_ok",
  "if_doubt",
  "if_not",
  "status",
];

export function LogLineShapePreview({
  shape,
  className,
}: {
  shape: LogLineShape;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-white/10 bg-black/20 p-3",
        "grid grid-cols-3 gap-x-4 gap-y-2 font-mono text-[10.5px]",
        className
      )}
    >
      {SLOTS.map((slot) => {
        const v = shape[slot];
        const empty = !v;
        return (
          <div key={slot} className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-neutral-600">
              {slot}
            </div>
            <div
              className={cn(
                "truncate",
                empty ? "text-neutral-700 italic" : "text-neutral-200"
              )}
            >
              {empty ? "—" : v}
            </div>
          </div>
        );
      })}
    </div>
  );
}
