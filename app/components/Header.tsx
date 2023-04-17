import { roboto } from "../fonts";
import Button from "./Button";
import Logo from "./Logo";

export default function Header() {
  return (
    <header>
      <div className="mt-5 flex flex-row">
        <div className="flex flex-col">
          <Logo />
          <p
            className={`${roboto.variable} mt-1 font-sans text-base italic text-white `}
          >
            one brick at a time
          </p>
        </div>
        <div className="ml-8 grid h-[48px] w-[48px] grid-cols-2 self-center">
          <div className="col-start-2 rounded-[5px] bg-brightgreen "></div>
          <div className="rounded-[5px] bg-lightblue"></div>
          <div className="rounded-[5px] bg-blue "></div>
        </div>
        <div className="ml-auto mobile:hidden">
          <Button variant="primary">+ new project</Button>
        </div>
      </div>
    </header>
  );
}
