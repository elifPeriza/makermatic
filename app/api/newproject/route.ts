import { NewProjectInsert } from "@/app/validations/newProjectSchema";
import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    NewProjectInsert.parse(body);

    await db
      .insert(projects)
      .values({
        userId: body.userId,
        colorPaletteId: body.colorPaletteId,
        name: body.name,
        description: body.description,
        notes: body.notes,
      })
      .returning()
      .all();
    revalidatePath("/");
    return NextResponse.json(
      { message: "Project successfully created" },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const zodErrorMessages = error.flatten().fieldErrors;
      return NextResponse.json(
        { error: { zodErrorMessages, type: "zod" } },
        { status: 400 }
      );
    } else {
      console.log(error);
      return NextResponse.json(
        {
          error: "Something went wrong, try again!",
        },
        { status: 500 }
      );
    }
  }
}
