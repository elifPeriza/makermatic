import isOlderThan24Hours from "@/app/utils/date";
import openai from "@/app/utils/openai";
import { systemMessageColorPalette } from "@/app/utils/prompts";
import { db } from "@/db/drizzle";
import { colorPalettes } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "drizzle-orm";
import isValidHSL from "@/app/utils/colors";

async function getOpenAIResponse(
  systemMessage: string,
  maxToken: number,
  temperature: number
) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    messages: [
      { role: "system", content: systemMessage },
      {
        role: "user",
        content: "Create a color palette with 3 colors",
      },
    ],
    functions: [
      {
        name: "store_color_palette",
        description: "store the colors as hsl values",
        parameters: {
          type: "object",
          properties: {
            color1: {
              type: "string",
              description: "the hsl value of the first color",
            },
            color2: {
              type: "string",
              description: "the hsl value of the second color",
            },
            color3: {
              type: "string",
              description: "the hsl value of the third color",
            },
          },
          required: ["color1", "color2", "color3"],
        },
      },
    ],
    max_tokens: maxToken,
    temperature: temperature,
  });

  const colorPaletteArguments =
    completion.data.choices[0].message?.function_call?.arguments;

  if (!colorPaletteArguments) return undefined;

  try {
    const colorPalette: {
      color1: string;
      color2: string;
      color3: string;
    } = JSON.parse(colorPaletteArguments);

    const ColorPalette = z.object({
      color1: z.string().refine(isValidHSL),
      color2: z.string().refine(isValidHSL),
      color3: z.string().refine(isValidHSL),
    });

    ColorPalette.parse(colorPalette);

    return colorPalette;
  } catch (error) {
    console.log(error);
    console.log("Failed to parse arguments");
    return undefined;
  }
}

export async function GET() {
  const [lastInsertedColorPalette] = await db
    .select()
    .from(colorPalettes)
    .orderBy(desc(colorPalettes.createdAt))
    .limit(1)
    .all();

  const countStatement = sql`SELECT COUNT(*) AS count FROM ${colorPalettes}`;
  const countObject: { count: number } = await db.get(countStatement);
  const totalRows: number = countObject.count;

  const errorMessage =
    "Oops, something went wrong, try again or select the current palette. No worries, you can change it later!";

  if (totalRows > 0) {
    const lastCreatedColorPaletteIsOlderThan24Hours = isOlderThan24Hours(
      lastInsertedColorPalette.createdAt
    );
    if (
      (!lastCreatedColorPaletteIsOlderThan24Hours && totalRows > 20) ||
      totalRows > 25
    ) {
      const randomColorPaletteStatement = sql`SELECT * FROM ${colorPalettes} ORDER BY random() LIMIT 1`;

      const randomColorPalette: {
        id: number;
        colors: string;
        created_at: string;
      } = await db.get(randomColorPaletteStatement);

      if (!randomColorPalette)
        return NextResponse.json({
          error: errorMessage,
        });

      const parsedRandomColorPalette = JSON.parse(randomColorPalette.colors);

      return NextResponse.json(parsedRandomColorPalette);
    }
  }

  const newColorPalette = await getOpenAIResponse(
    systemMessageColorPalette,
    65,
    1.3
  ).catch((e) => console.log(e));

  if (!newColorPalette)
    return NextResponse.json({
      error: errorMessage,
    });

  try {
    await db
      .insert(colorPalettes)
      .values({
        colors: JSON.stringify(newColorPalette),
      })
      .returning()
      .all();
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: errorMessage,
    });
  }

  return NextResponse.json(newColorPalette);
}
