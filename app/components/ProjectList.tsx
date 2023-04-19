"use client";

import { useState } from "react";
import { roboto_mono, roboto } from "../fonts";
import Button from "./Button";
import Emoji from "./Emoji";
import Tag from "./Tag";
import TaskSuggestion from "./TaskSuggestion";

import { TagLabel, Project } from "../api/projects/types";

type ProjectListProps = {
  projects: Project[];
};

type Tag = {
  label: TagLabel;
  emoji: string;
  emojiLabel?: string;
};

const tags: Tag[] = [
  { label: "all", emoji: "✨" },
  { label: "in progress", emoji: "🔨", emojiLabel: "hammer" },
  { label: "done", emoji: "👏", emojiLabel: "clapping hands" },
];

export default function ProjectList({ projects }: ProjectListProps) {
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [selectedTag, setSelectedTag] = useState<TagLabel>("all");

  const handleFilterChange = (projects: Project[], tagLabel: TagLabel) => {
    setFilteredProjects(projects);
    setSelectedTag(tagLabel);
  };
  return (
    <>
      <div className=" mt-8 md:hidden">
        <TaskSuggestion />
      </div>

      <div className=" mt-10 md:flex md:flex-row md:justify-between md:gap-10 ">
        <div className="flex flex-col">
          <div className="flex flex-col gap-6">
            <div className="flex flex-row justify-between">
              <h2
                className={`${roboto.variable} font-sans text-lg font-semibold text-white`}
              >
                my projects
              </h2>
              <div className="md:hidden">
                <Button variant="primary">+ new project</Button>
              </div>
            </div>

            {filteredProjects && (
              <div className="flex flex-wrap gap-3 ">
                {tags.map((tag) => (
                  <Tag
                    key={tag.label}
                    handleFilterChange={handleFilterChange}
                    tagLabel={tag.label}
                    projects={projects}
                    isSelected={selectedTag === tag.label}
                  >
                    {tag.label}{" "}
                    <Emoji label={tag.emojiLabel} symbol={tag.emoji} />
                  </Tag>
                ))}
              </div>
            )}
          </div>

          {filteredProjects && (
            <div className="mr-auto mt-10 flex max-w-2xl flex-wrap-reverse justify-center">
              {filteredProjects.map((project, i) => {
                return (
                  <div
                    key={project.id}
                    className={`group flex
                       h-24 min-w-[140px] cursor-pointer
                   flex-col justify-center rounded-[10px] border border-lightblue bg-darkblue hover:bg-softgreen mobile:w-[calc(100%/2)] mobile:nth-[3n+3]:mx-10 sm:w-[calc(100%/3)] sm:nth-[5n+4]:ml-10 sm:nth-[5n+5]:mr-10   `}
                  >
                    <p
                      className={`${roboto_mono.variable} p-3 text-center font-mono text-fontblue group-hover:text-darkblue `}
                    >
                      {project.title}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="mobile:hidden sm:hidden md:block">
          <TaskSuggestion />
        </div>
      </div>
    </>
  );
}
