import TabBar from "@/app/components/TabBar";
import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { unstable_cache } from "next/cache";

const getProjectByID = async (id: string) =>
  await unstable_cache(
    async () => {
      const projectWithTodos = await db.query.projects.findFirst({
        where: eq(projects.id, parseInt(id)),
        with: {
          tasks: true,
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

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProjectByID(params.id);
  const taskCount = project.tasks.length;
  const taskCountArray = Array.from({ length: taskCount }, (_, i) => i + 1);

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

          <div className="mt-8 flex justify-center ">
            <div className=" flex w-[200px] flex-wrap items-center justify-center ">
              {taskCountArray.map((_, index) => (
                <div
                  key={index}
                  className="h-[24px] w-[24px] rounded-[5px] border border-lightblue bg-darkblue"
                ></div>
              ))}
            </div>
          </div>

          <TabBar
            data={project}
            options={["todo's", "materials", "notes"]}
            id={params.id}
          />
        </>
      )}
    </>
  );
}
