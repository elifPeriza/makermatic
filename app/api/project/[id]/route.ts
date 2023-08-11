import { ProjectUpdate } from "@/app/validations/newProjectSchema";
import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    ProjectUpdate.parse(body);
    await db
      .update(projects)
      .set(body)
      .where(eq(projects.id, parseInt(params.id)))
      .all();

    revalidateTag(`project/${params.id}`);
    return NextResponse.json(
      { message: "Project successfully updated" },
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
