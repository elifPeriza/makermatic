"use client";

import { Task } from "@/db/schema";
import { Colors } from "../types/Project";
import { useState } from "react";

const lightnessIndex: Array<Number> = [
  58, 70, 64, 82, 58, 40, 52, 76, 46, 70, 82, 52, 46, 58, 76, 40, 88, 64, 88,
  40, 64, 52, 46, 76, 82, 58, 70, 46, 70, 76, 82,
];

const generateBrickColors = (tasks: Task[], colors: Colors) => {
  const colorIndex: Array<String> = [
    colors.color1,
    colors.color2,
    colors.color3,
    colors.color1,
    colors.color2,
    colors.color3,
    colors.color1,
  ];

  const brickColors = tasks.map((task) => {
    if (task.isCompleted && task.completedAt) {
      const monthDay = parseInt(task.completedAt.split("-")[2].split(" ")[0]);
      const weekday = new Date(task.completedAt as string).getDay();
      const color = colorIndex[weekday];
      const matchResult = color.match(/\d+/g)!;
      const [hue, saturation] = matchResult;

      const colorVariation = `hsl(${hue}, ${saturation}%, ${
        lightnessIndex[monthDay + 1]
      }%)`;

      return { taskID: task.id, color: colorVariation };
    } else {
      return {
        taskID: task.id,
        color: "#242A59",
      };
    }
  });

  return brickColors;
};

export default function ProgressDisplay({
  tasks,
  colors,
}: {
  tasks: Task[];
  colors: Colors;
}) {
  const brickColors = generateBrickColors(tasks, colors);
  const [progressBrickColors, setProgressBrickColors] = useState(brickColors);

  return (
    <div className="mt-8 flex justify-center">
      <div className="flex w-[200px] flex-wrap items-center justify-center ">
        {progressBrickColors.map((task) => (
          <div
            key={task.taskID}
            style={{
              backgroundColor: task.color,
              height: "24px",
              width: "24px",
              borderRadius: "5px",
              border: task.color === "#242A59" ? "1px solid #A6B1E1 " : "",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
