import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  connectionString: process.env.DB_URL,
  out: "./db/migrations",
  breakpoints: true,
} satisfies Config;
