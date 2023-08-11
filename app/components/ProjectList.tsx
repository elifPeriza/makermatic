"use client";

import { useState } from "react";
import Emoji from "./Emoji";
import Tag from "./Tag";
import { TagLabel } from "../types/Tags";
import { Project } from "@/db/schema";
import { useRouter } from "next/navigation";

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
  const [selectedTag, setSelectedTag] = useState<TagLabel>("all");
  const router = useRouter();
  const filterProjects = (tagLabel: TagLabel, projects: Project[]) => {
    if (tagLabel === "all") return projects;
    return projects.filter(({ isCompleted }) =>
      tagLabel === "done" ? isCompleted : !isCompleted
    );
  };
  const filteredProjects = filterProjects(selectedTag, projects);

  const handleFilterChange = (tagLabel: TagLabel) => {
    setSelectedTag(tagLabel);
  };

  return (
    <>
      {filteredProjects && (
        <div className="flex flex-wrap gap-3 ">
          {tags.map((tag) => (
            <Tag
              key={tag.label}
              onTagSelect={handleFilterChange}
              tagLabel={tag.label}
              isSelected={selectedTag === tag.label}
            >
              {tag.label} <Emoji label={tag.emojiLabel} symbol={tag.emoji} />
            </Tag>
          ))}
        </div>
      )}

      {filteredProjects && (
        <div className="mr-auto mt-10 flex max-w-2xl flex-wrap-reverse justify-center">
          {filteredProjects.map((project, i) => {
            return (
              <div
                role="button"
                tabIndex={i + 1}
                key={project.id}
                onClick={() => router.push(`/projects/${project.id}`)}
                className={`group flex
                     h-24 min-w-[140px] cursor-pointer
                 flex-col justify-center rounded-[10px] border border-lightblue bg-darkblue hover:bg-softgreen mobile:w-[calc(100%/2)] mobile:nth-[3n+3]:mx-10 sm:w-[calc(100%/3)] sm:nth-[5n+4]:ml-10 sm:nth-[5n+5]:mr-10   `}
              >
                <p
                  className={` p-3 text-center font-mono font-medium text-fontblue group-hover:text-darkblue `}
                >
                  {project.name}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
