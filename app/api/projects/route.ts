import projects from "./projects.json";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json(projects);
}
