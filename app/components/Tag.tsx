import { ReactNode } from "react";
import { roboto_mono } from "../fonts";

type TagProps = {
  children: ReactNode;
};

export default function Tag({ children }: TagProps) {
  return (
    <div
      className={` inline-block cursor-pointer rounded-[5px] bg-lightblue px-3 py-1 ${roboto_mono.variable} font-mono text-sm text-darkblue hover:bg-softgreen`}
    >
      {children}
    </div>
  );
}
