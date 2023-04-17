import { roboto_mono, roboto } from "../fonts";

const projects = [
  "arched garden shelf",
  "japanese inspired fabric art what ",
  "wood block art",
  "fabric lamp shade",
  "rustic wooden bench",
  "abstract canvas art",
  "something else",
];

export default function ProjectList() {
  return (
    <>
      {
        <div className="mt-6">
          <h2
            className={`${roboto.variable} font-sans text-xl font-semibold text-white`}
          >
            my projects
          </h2>

          <div className="mr-auto mt-3 flex max-w-3xl flex-wrap-reverse justify-center">
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
      }
    </>
  );
}
