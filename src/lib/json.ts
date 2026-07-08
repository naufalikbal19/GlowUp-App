import type { Prisma } from "@/generated/prisma/client";

/** Prisma's InputJsonValue requires an index signature; our domain types don't have one by design. */
export function toJsonInput<T>(value: T): Prisma.InputJsonValue {
  return value as unknown as Prisma.InputJsonValue;
}
