import { roboto } from "../fonts";
import Logo from "./Logo";

export default function Header() {
  return (
    <header>
      <div className="flex flex-row mt-5">
        <div className="flex flex-col">
          <Logo />
          <p
            className={`${roboto.variable} font-sans text-white text-base italic mt-1 `}
          >
            one brick at a time
          </p>
        </div>
        <div className="grid grid-cols-2 w-[48px] h-[48px] self-center ml-8">
          <div className="col-start-2 rounded-[5px] bg-brightgreen "></div>
          <div className="bg-lightblue rounded-[5px]"></div>
          <div className="bg-blue rounded-[5px] "></div>
        </div>
      </div>
    </header>
  );
}
