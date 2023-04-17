import Header from "./components/Header";
import ProjectList from "./components/ProjectList";

export default function Home() {
  return (
    <main className="mx-auto max-w-[1400px] px-[5%]">
      <Header />
      <ProjectList />
    </main>
  );
}
