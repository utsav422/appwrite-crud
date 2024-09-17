import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

// Create a task
async function createTask(data: { term: string; task: string }) {
  try {
    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string, // Ensure this is set
      "tasks", // Ensure this collection ID is correct
      ID.unique(),
      data
    );
    return response;
  } catch (error) {
    console.error("Error creating task", error);
    throw new Error("Failed to create task");
  }
}

// Fetch tasks
async function fetchTasks() {
  try {
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID as string,
      "tasks", // Ensure this collection ID is correct
      [Query.orderDesc("$createdAt")] // Fetch documents in descending order
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching tasks", error);
    throw new Error("Failed to fetch tasks");
  }
}

// POST: Create a task
export async function POST(req: Request) {
  try {
    const { term, task } = await req.json();
    if (!term || !task) {
      return NextResponse.json(
        { message: "Term and task are required fields" },
        { status: 400 }
      );
    }

    const data = { term, task };
    const response = await createTask(data);

    return NextResponse.json(
      { message: "Task created", response },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create task" },
      { status: 500 }
    );
  }
}

// GET: Fetch tasks
export async function GET() {
  try {
    const tasks = await fetchTasks();
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
