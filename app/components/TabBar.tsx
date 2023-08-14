"use client";

import { Tab } from "@headlessui/react";
import TodoList from "./TodoList";
import useValiForm from "../hooks/useValiForm";
import {
  ProjectUpdate,
  ProjectUpdateSchema,
  ProjectUpdateType,
} from "../validations/newProjectSchema";
import { useState } from "react";
import Button from "./Button";
import { classNames } from "../utils/classNames";
import { CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProjectContent, ProjectContentCategories } from "../types/Project";

type ProjectTabBarProps = {
  id: string;
  content: ProjectContent;
  options: ProjectContentCategories[];
};

const updateProject = (updatedInputs: ProjectUpdateType, id: string) => {
  return fetch(`http://localhost:3000/api/project/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedInputs),
  });
};

export default function ProjectTabBar({
  content,
  id,
  options,
}: ProjectTabBarProps) {
  const notes = content.notes;
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);

  const { register, inputs, inputErrors, inputReset, handleSubmit, status } =
    useValiForm<ProjectUpdateSchema, ProjectUpdateType>(
      ProjectUpdate,
      (inputs) => updateProject({ notes: inputs.notes }, id),
      { notes: notes ?? undefined },
      () => {
        setIsEditMode(false);
        router.refresh();
      }
    );

  return (
    <div className="w-full max-w-md px-2 py-16 sm:px-0">
      <Tab.Group>
        <Tab.List className="bg-blue-900/20 mb-4 flex p-1">
          {options.map((option) => (
            <Tab
              key={option}
              className={({ selected }) =>
                classNames(
                  " text-sans mx-0 w-full  text-base font-semibold leading-5",
                  " focus:outline-none",
                  selected
                    ? "rounded-lg rounded-b-none border-l-2 border-r-2 border-t-2 border-t-brightgreen py-2.5 text-brightgreen"
                    : "ml-0 border-b-2 border-b-brightgreen text-white hover:bg-white/[0.12] hover:text-white"
                )
              }
            >
              {option}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="px-2">
          <Tab.Panel>
            <TodoList initialTasks={content.tasks} />
          </Tab.Panel>
          <Tab.Panel>
            <TodoList initialTasks={content.materialTasks} />
          </Tab.Panel>
          <Tab.Panel className="font-sans text-white">
            <form
              className="mt-8 flex flex-col gap-3 text-base"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-row items-center justify-end gap-6">
                {status === "success" && (
                  <div className="flex flex-row items-center justify-end gap-3">
                    <p className="text-brightgreen">saved</p>
                    <CheckCheck className="stroke-brightgreen" />
                  </div>
                )}
                {isEditMode && status !== "success" && status !== "error" ? (
                  <>
                    {status === undefined && (
                      <button
                        className="font-medium text-white"
                        onClick={() => {
                          setIsEditMode(false);
                          inputReset();
                        }}
                      >
                        cancel
                      </button>
                    )}
                    <Button variant="primary" type="submit">
                      {status === "loading" ? "saving..." : "save"}
                    </Button>
                  </>
                ) : (
                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      onClick={() => {
                        inputReset();
                        setIsEditMode(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                )}
              </div>
              {inputErrors?.notes && (
                <p className=" text-lightred">
                  {inputErrors.notes.map((error) => error)}
                </p>
              )}
              {status === "error" && !inputErrors && (
                <p className="text-lightred">
                  Something went wrong, try again!
                </p>
              )}

              <textarea
                readOnly={!isEditMode}
                onFocus={() => {
                  status === "success" && inputReset();
                  !isEditMode && setIsEditMode(true);
                }}
                {...register("notes")}
                className="mb-1 h-[700px] min-h-[32px] w-full rounded-md border border-lightblue bg-darkblue p-4 text-base"
              >
                {notes}
              </textarea>
            </form>

            <div className="mb-3 flex flex-row justify-between">
              {isEditMode && (
                <p className="self-start text-xs">
                  {inputs.notes?.length ?? 0}/1000
                </p>
              )}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
