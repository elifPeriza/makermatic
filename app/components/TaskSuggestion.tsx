import { roboto } from "../fonts";
import Button from "./Button";
import Emoji from "./Emoji";
import HourGlass from "./HourGlass";

async function getTaskSuggestion() {
  const response = await fetch("http://localhost:3000/api/suggestion", {
    next: { revalidate: 60 * 60 * 24 },
  });

  const suggestion = await response.json();
  return suggestion;
}

export default async function TaskSuggestion() {
  const { motivatingMessage, estimatedTimeToCompleteInMinutes, error } =
    await getTaskSuggestion();

  return (
    <div className=" flex min-w-[250px] max-w-sm flex-col gap-3 ">
      <h2
        className={`${roboto.variable} font-sans text-lg font-semibold text-white`}
      >
        Your daily task suggestion
      </h2>
      <div className="flex flex-row justify-between">
        <p
          className={`${roboto.variable} mr-3 max-w-xs font-sans text-base text-white`}
        >
          {error
            ? error
            : motivatingMessage
            ? motivatingMessage
            : `Hello there! I'm your DIY Task Assistant and here to help you make the most out of your creative endeavors. Let's embark on this exciting journey together! Just share the status of your most active project, and I'll provide you with a daily task suggestion that will keep you moving forward. 
            No matter the challenge, I'm here to encourage and support you every step of the way. `}
        </p>
        <Emoji label="sun" symbol="☀️" />
      </div>
      <div className="mt-4 flex flex-row justify-between">
        <Button variant="secondary">Go to task</Button>
        <div className="flex flex-row gap-3">
          <p
            className={`${roboto.variable} max-w-xs self-center font-sans text-base text-white`}
          >
            {estimatedTimeToCompleteInMinutes
              ? `${estimatedTimeToCompleteInMinutes} min. `
              : "Be your own time master!"}
          </p>
          <HourGlass />
        </div>
      </div>
    </div>
  );
}
