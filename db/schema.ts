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
  colors: text("colors").notNull().default("87CEEB,FF7F50,FFD700"),
});

export type Project = InferModel<typeof projects, "select">;

export const projectsRelations = relations(projects, ({ many, one }) => ({
  tasks: many(tasks),
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}));

export const tasks = sqliteTable("tasks", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  projectId: integer("project_id").references(() => projects.id),
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

export const taskSuggestions = sqliteTable("tasksuggestions", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  content: text("content"),
  userId: integer("user_id").references(() => users.id),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  taskId: integer("task_id").references(() => tasks.id),
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
