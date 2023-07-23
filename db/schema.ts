import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { InferModel, relations, sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type User = InferModel<typeof users, "select">;

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
}));

export const colorPalettes = sqliteTable("color_palettes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  colors: text("colors").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type ColorPalette = InferModel<typeof colorPalettes, "select">;

export const colorPalettesRelations = relations(colorPalettes, ({ many }) => ({
  projects: many(projects),
}));

export const projects = sqliteTable("projects", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  name: text("name").notNull().default("new project"),
  description: text("description"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  completedAt: text("completed_at"),
  isCompleted: integer("is_completed").notNull().default(0),
  notes: text("notes"),
  colorPaletteId: integer("colorpalette_id")
    .notNull()
    .references(() => colorPalettes.id),
});

export type Project = InferModel<typeof projects, "select">;

export const projectsRelations = relations(projects, ({ many, one }) => ({
  tasks: many(tasks),
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  colorPalette: one(colorPalettes, {
    fields: [projects.colorPaletteId],
    references: [colorPalettes.id],
  }),
}));

export const tasks = sqliteTable("tasks", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id),
  description: text("description").notNull().default("new task"),
  type: text("type").notNull().default("to-do"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  completedAt: text("completed_at"),
  isCompleted: integer("is_completed").notNull().default(0),
});
export type Tasks = InferModel<typeof tasks, "select">;

export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}));

export const taskSuggestions = sqliteTable("task_suggestions", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  content: text("content"),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  taskId: integer("task_id")
    .notNull()
    .references(() => tasks.id),
  estimatedTime: integer("estimated_time"),
});

export type TaskSuggestion = InferModel<typeof taskSuggestions, "select">;

export const taskSuggestionsRelations = relations(
  taskSuggestions,
  ({ one }) => ({
    user: one(users, {
      fields: [taskSuggestions.userId],
      references: [users.id],
    }),
    task: one(tasks, {
      fields: [taskSuggestions.taskId],
      references: [tasks.id],
    }),
  })
);
