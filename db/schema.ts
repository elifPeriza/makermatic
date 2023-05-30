import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const projects = sqliteTable("projects", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull().default("new project"),
  description: text("description"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  completedAt: text("completed_at"),
  isCompleted: integer("is_completed").notNull().default(0),
  notes: text("notes"),
  colors: text("colors").notNull().default("87CEEB,FF7F50,FFD700"),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").references(() => projects.id),
  description: text("description").notNull().default("new task"),
  type: text("type").notNull().default("to-do"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  completedAt: text("completed_at"),
  isCompleted: integer("is_completed").notNull().default(0),
});
