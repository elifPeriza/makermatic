import { Suspense } from "react";
import Header from "./components/Header";
import ProjectList from "./components/ProjectList";
import TaskSuggestion from "./components/TaskSuggestion";
import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import TaskSuggestionLoader from "./components/TaskSuggestionLoader";

const getProjects = async () => {
  const allProjects = await db.select().from(projects).all();
  return allProjects;
};

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <main className="mx-auto max-w-[1600px] px-[5%]">
        <Header />
        <div className=" mt-8 md:hidden">
          <h2 className={`font-sans text-lg font-semibold text-white`}>
            Your daily task suggestion
          </h2>
          <Suspense fallback={<TaskSuggestionLoader />}>
            <TaskSuggestion />
          </Suspense>
        </div>

        <div className=" mt-10 md:flex md:flex-row md:justify-between md:gap-10 ">
          <div className="flex flex-col">
            <div className="flex flex-col gap-6">
              <div className="flex flex-row justify-between">
                <h2 className={` font-sans text-lg font-semibold text-white`}>
                  my projects
                </h2>
              </div>
              <ProjectList projects={projects} />
            </div>
          </div>

          <div className="mobile:hidden sm:hidden md:block">
            <h2 className={`font-sans text-lg font-semibold text-white`}>
              Your daily task suggestion
            </h2>
            <Suspense fallback={<TaskSuggestionLoader />}>
              <TaskSuggestion />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}
