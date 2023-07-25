import HourGlass from "./HourGlass";

export default function TaskSuggestionLoader() {
  return (
    <div className=" animate-show opacity-0">
      <div className=" flex max-w-xs flex-col items-center justify-center gap-3 font-sans text-base text-white">
        <h2>Hello there! Your task buddy is brewing up the task for today!</h2>
        <HourGlass className="animate-wiggle" />
      </div>
    </div>
  );
}
