import { roboto } from "../fonts";
import Button from "./Button";
import Emoji from "./Emoji";
import HourGlass from "./HourGlass";

export default function TaskSuggestion() {
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
          Based on today's sunny weather, why not cut the plywood for your
          Arched Garden Shelf project?
        </p>
        <Emoji label="sun" symbol="☀️" />
      </div>
      <div className="mt-4 flex flex-row justify-between">
        <Button variant="secondary">Go to task</Button>
        <div className="flex flex-row gap-3">
          <p
            className={`${roboto.variable} max-w-xs self-center font-sans text-base text-white`}
          >
            25 min.
          </p>
          <HourGlass />
        </div>
      </div>
    </div>
  );
}
