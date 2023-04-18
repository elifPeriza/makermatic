import { roboto_mono, roboto } from "../fonts";
import Button from "./Button";
import Emoji from "./Emoji";
import Tag from "./Tag";
import TaskSuggestion from "./TaskSuggestion";

const projects = [
  "arched garden shelf",
  "japanese inspired fabric art what ",
  "wood block art",
  "fabric lamp shade",
  "rustic wooden bench",
  "abstract canvas art",
  "something else",
];

const tags = [
  { text: "all", symbol: "✨" },
  { text: "in progress", symbol: "🔨", label: "hammer" },
  { text: "done", symbol: "👏", label: "clapping hands" },
];

export default function ProjectList() {
  return (
    <>
      <div className=" mt-8 md:hidden">
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

            <div className="flex flex-wrap gap-3 ">
              {tags.map((tag) => (
                <Tag key={tag.text}>
                  {tag.text} <Emoji label={tag.label} symbol={tag.symbol} />
                  {/* {tag.text} {tag.symbol && tag.symbol} */}
                </Tag>
              ))}
            </div>
          </div>

          <div className="mr-auto mt-10 flex max-w-2xl flex-wrap-reverse justify-center">
            {projects.map((project, i) => {
              return (
                <div
                  key={project}
                  className={`group flex
                       h-24 min-w-[140px] cursor-pointer
                   flex-col justify-center rounded-[10px] border border-lightblue bg-darkblue hover:bg-softgreen mobile:w-[calc(100%/2)] mobile:nth-[3n+3]:mx-10 sm:w-[calc(100%/3)] sm:nth-[5n+4]:ml-10 sm:nth-[5n+5]:mr-10   `}
                >
                  <p
                    className={`${roboto_mono.variable} p-3 text-center font-mono text-fontblue group-hover:text-darkblue `}
                  >
                    {project}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mobile:hidden sm:hidden md:block">
          <TaskSuggestion />
        </div>
      </div>
    </>
  );
}
