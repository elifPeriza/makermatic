import Header from "./components/Header";
import ProjectList from "./components/ProjectList";
import TaskSuggestion from "./components/TaskSuggestion";
import { roboto } from "./fonts";
import Button from "./components/Button";
import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";

export const revalidate = 60;

async function getProjects() {
  const allProjects = await db.select().from(projects).all();

  return allProjects;
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <main className="mx-auto max-w-[1400px] px-[5%]">
        <Header />
        <div className=" mt-8 md:hidden">
          {/* @ts-expect-error Async Server Component */}
          <TaskSuggestion />
        </div>
        <div className=" mt-10 md:flex md:flex-row md:justify-between md:gap-10 ">
          <div className="flex flex-col">
            <div className="flex flex-col gap-6">
              <div className="flex flex-row justify-between">
                <h2
                  className={`${roboto.variable} font-sans text-lg font-semibold text-white`}
                >
                  my projects
                </h2>
                <div className="md:hidden">
                  <Button variant="primary">+ new project</Button>
                </div>
              </div>
              <ProjectList projects={projects} />
            </div>
          </div>
          <div className="mobile:hidden sm:hidden md:block">
            {/* @ts-expect-error Async Server Component */}
            <TaskSuggestion />
          </div>
        </div>
      </main>
    </>
  );
}
