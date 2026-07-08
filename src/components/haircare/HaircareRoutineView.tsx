import { Card } from "@/components/ui";

interface RoutineStepLike {
  step: string;
  product: string;
  note?: string;
}

interface DayRoutineLike {
  day: string;
  steps: RoutineStepLike[];
}

export function HaircareRoutineView({
  days,
  generalTips,
}: {
  days: DayRoutineLike[];
  generalTips: string[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {days.map((day) => (
          <Card key={day.day} className="flex flex-col gap-2">
            <span className="font-medium">{day.day}</span>
            <ol className="flex flex-col gap-1 text-sm">
              {day.steps.map((s, i) => (
                <li key={i}>
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">{s.step}:</span>{" "}
                  <span className="text-neutral-600 dark:text-neutral-400">{s.product}</span>
                  {s.note && <span className="block text-xs text-neutral-400">{s.note}</span>}
                </li>
              ))}
            </ol>
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
