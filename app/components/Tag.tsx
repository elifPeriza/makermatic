import { ReactNode } from "react";
import { roboto_mono } from "../fonts";
import { TagLabel, Project } from "../api/projects/types";

type HandleFilterChange = (projects: Project[], tagText: TagLabel) => void;

type TagProps = {
  children: ReactNode;
  handleFilterChange: HandleFilterChange;
  tagLabel: TagLabel;
  projects: Project[];
  isSelected: boolean;
};

const filterProjects = (tagLabel: TagLabel, projects: Project[]) => {
  if (tagLabel === "all") return projects;
  return projects.filter(({ isCompleted }) =>
    tagLabel === "done" ? isCompleted : !isCompleted
  );
};

const handleTagSelect = (
  tagLabel: TagLabel,
  projects: Project[],
  handleFilterChange: HandleFilterChange
) => {
  const filteredProjects = filterProjects(tagLabel, projects);
  return handleFilterChange(filteredProjects, tagLabel);
};

export default function Tag({
  children,
  tagLabel,
  handleFilterChange,
  projects,
  isSelected,
}: TagProps) {
  const handleClick = () => {
    if (isSelected) return;
    handleTagSelect(tagLabel, projects, handleFilterChange);
  };
  return (
    <button
      className={` inline-block cursor-pointer rounded-[5px] ${
        isSelected ? "bg-softgreen" : "bg-lightblue"
      } px-3 py-1 ${
        roboto_mono.variable
      } font-mono text-sm text-darkblue hover:bg-softgreen`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
