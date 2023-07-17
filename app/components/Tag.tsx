import { ReactNode } from "react";
import { TagLabel } from "../types/Tags";

type HandleFilterChange = (tagText: TagLabel) => void;

type TagProps = {
  children: ReactNode;
  onTagSelect: HandleFilterChange;
  tagLabel: TagLabel;
  isSelected: boolean;
};

export default function Tag({
  children,
  tagLabel,
  onTagSelect,
  isSelected,
}: TagProps) {
  const handleClick = () => {
    if (isSelected) return;
    onTagSelect(tagLabel);
  };
  return (
    <button
      className={` inline-block cursor-pointer rounded-[5px] ${
        isSelected ? "bg-softgreen" : "bg-lightblue"
      } px-3 py-1 font-mono text-sm font-medium text-darkblue hover:bg-softgreen`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
