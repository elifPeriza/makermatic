import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

// Connection to the SQLite Database, creating a client object with the URL to the database file
const client = createClient({
  url: "file:db/dev.db",
});
//console.log({ client });

//// Creating a drizzle object from the client object which we need to work with the database
export const db = drizzle(client);
//console.log({ db });
