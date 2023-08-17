import TabBar from "@/app/components/TabBar";
import { db } from "@/db/drizzle";
import { ProjectWithTasks, projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { ProjectContentCategories } from "@/app/types/Project";
import ProgressDisplay from "@/app/components/ProgressDisplay";

const getProjectByID = async (id: string) =>
  await unstable_cache(
    async () => {
      const projectWithTodos = await db.query.projects.findFirst({
        where: eq(projects.id, parseInt(id)),
        with: {
          tasks: true,
          colorPalette: {
            columns: {
              colors: true,
            },
          },
        },
      });
      if (!projectWithTodos) {
        throw new Error("Project not found");
      } else {
        return projectWithTodos;
      }
    },
    [`project/${id}`],
    { tags: [`project/${id}`], revalidate: 600 }
  )();

const createProjectDataTabBar = async (project: ProjectWithTasks) => {
  const tasks = project.tasks.filter((todo) => todo.type === "to-do");
  const materialTasks = project.tasks.filter(
    (todo) => todo.type === "material"
  );
  const notes = project.notes;
  const projectContent = { tasks, materialTasks, notes };
  const options: ProjectContentCategories[] = ["tasks", "materials", "notes"];

  return { projectContent, options };
};

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProjectByID(params.id);

  const { projectContent, options } = await createProjectDataTabBar(project);
  const colors = JSON.parse(project.colorPalette.colors);

  return (
    <>
      {project && (
        <>
          <div className="flex flex-row items-start ">
            <Link href={"/"}>
              <ArrowLeft
                size={28}
                className="mt-1 min-w-[30px] stroke-brightgreen"
              />
            </Link>

            <div className="mx-3 flex flex-col">
              <h1 className="font-logo text-3xl  text-brightgreen">
                {project.name}
              </h1>
              <h2 className="font-sans text-base  italic text-white">
                {project.description}
              </h2>
            </div>
            <Pencil
              size={28}
              className="ml-auto mt-2 min-w-[30px] stroke-brightgreen"
            />
          </div>

          <ProgressDisplay tasks={project.tasks} colors={colors} />

          <TabBar content={projectContent} options={options} id={params.id} />
        </>
      )}
    </>
  );
}
