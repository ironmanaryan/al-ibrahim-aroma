import type { ActivityKind, DB } from "./types";
import { uid } from "./utils";

/**
 * Append an event to the house activity log. Mutates the database object so it
 * can be called from inside an existing updateDB() transaction.
 */
export function pushActivity(
  db: DB,
  kind: ActivityKind,
  title: string,
  detail?: string,
  meta?: Record<string, string | number>,
) {
  if (!Array.isArray(db.activity)) db.activity = [];
  db.activity.unshift({
    id: uid("ev"),
    kind,
    title,
    detail,
    meta,
    at: new Date().toISOString(),
  });
  if (db.activity.length > 500) db.activity.length = 500;
}
