import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./db/schema.ts",
  dbCredentials: { url: process.env.DB_URL || "file:db/dev.db" },
  out: "./db/migrations",
  driver: "libsql",
  breakpoints: true,
} satisfies Config;
