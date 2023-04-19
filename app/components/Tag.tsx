import { ReactNode } from "react";
import { roboto_mono } from "../fonts";
import { TagLabel, Project } from "../types";

type HandleFilterChange = (projects: Project[], tagText: TagLabel) => void;

type TagProps = {
  children: ReactNode;
  handleFilterChange: HandleFilterChange;
  tagLabel: TagLabel;
  projects: Project[];
  isSelected: boolean;
};

const handleTagSelect = (
  tagLabel: TagLabel,
  projects: Project[],
  handleFilterChange: HandleFilterChange
) => {
  let filteredProjects = projects;
  if (tagLabel === "in progress") {
    filteredProjects = projects.filter(
      (project: Project) => project.isCompleted === false
    );
  } else if (tagLabel === "done") {
    filteredProjects = projects.filter(
      (project: Project) => project.isCompleted === true
    );
  }
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
