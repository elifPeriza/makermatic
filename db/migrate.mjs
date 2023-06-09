import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

// Connection to the SQLite Database, creating a client object with the URL to the database file
const client = createClient({
  url: "file:db/dev.db",
});
//console.log({ client });

// Creating a drizzle object from the client object which we need to apply the migrations (generated by Drizzle Kit) to the connected database

const db = drizzle(client);
//console.log({ db });

// applying the migrations to the SQLite database using the drizzle object

migrate(db, { migrationsFolder: "./db/migrations" }).then(() =>
  console.log("migrations complete")
);
