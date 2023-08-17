"use client";

import { Task } from "@/db/schema";
import { Colors } from "../types/Project";
import { useState } from "react";

const lightnessIndex: { [key: string]: number } = {
  "01": 40,
  "02": 46,
  "03": 52,
  "04": 58,
  "05": 64,
  "06": 70,
  "07": 76,
  "08": 82,
  "09": 88,
  "10": 40,
  "11": 46,
  "12": 52,
  "13": 58,
  "14": 64,
  "15": 70,
  "16": 76,
  "17": 82,
  "18": 88,
  "19": 40,
  "20": 46,
  "21": 52,
  "22": 58,
  "23": 64,
  "24": 70,
  "25": 76,
  "26": 82,
  "27": 88,
  "28": 40,
  "29": 46,
  "30": 52,
  "31": 58,
};

const generateBrickColors = (tasks: Task[], colors: Colors) => {
  const colorIndex: { [key: number]: string } = {
    0: colors.color1,
    1: colors.color2,
    2: colors.color3,
    3: colors.color1,
    4: colors.color2,
    5: colors.color3,
    6: colors.color1,
  };
  const brickColors = tasks.map((task) => {
    if (task.isCompleted && task.completedAt) {
      const monthDay = task.completedAt.split("-")[2].split(" ")[0];
      const weekday = new Date(task.completedAt as string).getDay();
      const color = colorIndex[weekday];
      const matchResult = color.match(/\d+/g)!;
      const [hue, saturation] = matchResult;

      const colorVariation = `hsl(${hue}, ${saturation}%, ${lightnessIndex[monthDay]}%)`;

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
