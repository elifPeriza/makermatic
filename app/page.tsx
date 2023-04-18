import Header from "./components/Header";
import ProjectList from "./components/ProjectList";

async function getProjects() {
  const response = await fetch("http://localhost:3000/api/projects", {
    next: { revalidate: 1 },
  });
  const projects = await response.json();
  return projects;
}
export default async function Home() {
  const projects = await getProjects();

  return (
    <main className="mx-auto max-w-[1400px] px-[5%]">
      <Header />
      <ProjectList projects={projects} />
    </main>
  );
}
