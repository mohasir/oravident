import { pgTable, uuid, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { appNotifications } from "./app_notifications.ts";
import { users } from "./users.ts";

export const appNotificationReads = pgTable("app_notification_reads", {
  id: uuid("id").primaryKey().defaultRandom(),
  notificationId: uuid("notification_id").notNull().references(() => appNotifications.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  readAt: timestamp("read_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("app_notif_read_idx").on(table.notificationId, table.userId),
]);
