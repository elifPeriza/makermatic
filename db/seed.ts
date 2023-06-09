import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { projects, tasks, users } from "./schema";
//import * as schema from "./schema";

// Connection to the SQLite Database, creating a client object with the URL to the database file
const client = createClient({
  url: "file:db/dev.db",
});

// Creating a drizzle object from the client object which we need to apply the migrations (generated by Drizzle Kit) to the connected database

const db = drizzle(client);

const createUser = async () => {
  await db.insert(users).values({ id: 1 }).returning().all();
};

createUser();

const createProjectsWithTasks = async () => {
  const insertedProjects = await db
    .insert(projects)
    .values([
      {
        name: "Wood Art",
        description: "Colorful japanese wood block art",
        userId: 1,
      },
      {
        name: "Fabric Art Piece",
        description: "Japanese inspired Linen Fabric Art",
        userId: 1,
      },
      {
        name: "Arched Shelving",
        description: "Mediterranean inspired shelving with arched frame",
        userId: 1,
      },
    ])
    .returning()
    .all();

  const insertedTasks = await db
    .insert(tasks)
    .values([
      {
        description: "Decide on wood arrangement",
        projectId: insertedProjects[0].id,
        isCompleted: 1,
      },
      {
        description: "wood",
        type: "material",
        projectId: insertedProjects[0].id,
      },
      {
        description: "cut wood",
        projectId: insertedProjects[0].id,
      },
      {
        description: "paint wood cuts",
        projectId: insertedProjects[0].id,
      },
      {
        description: "timber for art frame",
        type: "material",
        projectId: insertedProjects[1].id,
      },
      {
        description: "buy fabric",
        projectId: insertedProjects[1].id,
        isCompleted: 1,
      },
      {
        description: "decide on motif",
        projectId: insertedProjects[1].id,
        isCompleted: 1,
      },
      {
        description: "cut fabric",
        projectId: insertedProjects[1].id,
      },
    ])
    .returning()
    .all();
};

createProjectsWithTasks();
