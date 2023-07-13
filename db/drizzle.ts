import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Connection to the SQLite Database, creating a client object with the URL to the database file
const client = createClient({
  url: "file:db/dev.db",
});

//// Creating a drizzle object from the client object which we need to work with the database
export const db = drizzle(client, { schema });
