export default function Logo() {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col">
        <h1 className="font-logo text-5xl leading-8 text-brightgreen">
          makermatic
        </h1>
        <p className={`font-sans text-base italic text-white `}>
          one brick at a time
        </p>
      </div>
      <div className="ml-8 grid h-[48px] w-[48px] grid-cols-2 self-center">
        <div className="col-start-2 rounded-[5px] bg-brightgreen "></div>
        <div className="rounded-[5px] bg-lightblue"></div>
        <div className="rounded-[5px] bg-blue "></div>
      </div>
    </div>
  );
}
