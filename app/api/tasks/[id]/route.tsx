import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

async function fetchTasks(id: string) {
  try {
    const task = await database.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "tasks",
      id
    );
    return task;
  } catch (error) {
    console.error("error fetching tasks", error);
    throw new Error("failed to create the task ");
  }
}
async function deletetask(id: string) {
  try {
    const response = await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "tasks",
      id
    );
    return response;
  } catch (error) {
    console.error("error deleting task");
    throw new Error("failed to delete the task");
  }
}

async function updatetask(id: string, data: { term: string; task: string }) {
  try {
    const response = await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "tasks",
      id,
      data
    );
    return response;
  } catch (error) {
    console.error("error updating task");
    throw new Error("failed to updatethe task");
  }
}
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const task = await fetchTasks(id);
    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json(
      { error: " failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await deletetask(id);
    return NextResponse.json({ mesage: " deleted task" });
  } catch (error) {
    return NextResponse.json(
      { error: " failed to delete task" },
      { status: 500 }
    );
  }
}
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const task = await req.json();
    await updatetask(id, task);
    return NextResponse.json({ message: " updated task" });
  } catch (error) {
    return NextResponse.json(
      { error: " failed to update task" },
      { status: 500 }
    );
  }
}
