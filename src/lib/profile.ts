import { db } from "./db";

/** Single-user MVP: the "active" profile is simply the most recently updated one. */
export async function getActiveProfile() {
  return db.profile.findFirst({ orderBy: { updatedAt: "desc" } });
}
