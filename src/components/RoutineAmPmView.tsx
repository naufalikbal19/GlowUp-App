import { Card } from "@/components/ui";
import { Sun, Moon } from "lucide-react";

export interface RoutineStepLike {
  step: string;
  product: string;
  note?: string;
}

export interface DayRoutineLike {
  day: string;
  am: RoutineStepLike[];
  pm: RoutineStepLike[];
}

export function RoutineAmPmView({ days, generalTips }: { days: DayRoutineLike[]; generalTips: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {days.map((day) => (
          <Card key={day.day} className="flex flex-col gap-3">
            <span className="font-medium">{day.day}</span>
            <Session icon={<Sun size={14} className="text-amber-500" />} label="Pagi" steps={day.am} />
            <Session icon={<Moon size={14} className="text-indigo-500" />} label="Malam" steps={day.pm} />
          </Card>
        ))}
      </div>
      {generalTips.length > 0 && (
        <Card>
          <h3 className="mb-2 font-semibold">Tips Umum</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-600 dark:text-neutral-400">
            {generalTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function Session({ icon, label, steps }: { icon: React.ReactNode; label: string; steps: RoutineStepLike[] }) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {icon} {label}
      </div>
      <ol className="flex flex-col gap-1 text-sm">
        {steps.map((s, i) => (
          <li key={i}>
            <span className="font-medium text-neutral-700 dark:text-neutral-300">{s.step}:</span>{" "}
            <span className="text-neutral-600 dark:text-neutral-400">{s.product}</span>
            {s.note && <span className="block text-xs text-neutral-400">{s.note}</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}
