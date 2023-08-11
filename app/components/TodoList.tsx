"use client";

import { Task } from "@/db/schema";
import { useState } from "react";
import TodoDisplay from "./TodoDisplay";

export default function TodoList({
  initialTasks,
  header,
}: {
  initialTasks: Task[];
  header?: string;
}) {
  const [tasks, setTasks] = useState(initialTasks);

  return (
    <>
      <div className="flex flex-col gap-2 font-sans text-white">
        <h3 className="font-semibold">{header}</h3>
        {tasks.map((task) => (
          <div key={task.id}>
            <TodoDisplay
              description={task.description}
              variant={`${!task.isCompleted ? "open" : "completed"}`}
            />
          </div>
        ))}
      </div>
    </>
  );
}
