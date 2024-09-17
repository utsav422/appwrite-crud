"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface TaskProps {
  $id: string;
  term: string;
  task: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<TaskProps[] | null>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load tasks. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });

      setTasks((prevTasks) => {
        if (!prevTasks) return []; // Return an empty array if prevTasks is null
        return prevTasks.filter((task) => task.$id !== id);
      });
    } catch (error) {
      setError("Failed to delete the task.");
    }
  };

  return (
    <div>
      {error && <p className="py-4 text-red-500">{error}</p>}
      {isLoading ? (
        <p>Loading tasks...</p>
      ) : tasks && tasks?.length > 0 ? ( // Fixed ternary syntax here
        <>
          {tasks?.map((task) => (
            <div key={task.$id} className="p-4 rounded-md border-b leading-8">
              <div className="font-bold">{task.term}</div>
              <div>{task.task}</div>
              <div className="flex gap-4 justify-end">
                <Link
                  className="bg-slate-200 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                  href={`/edit/${task.$id}`}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(task.$id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                >
                  DELETE
                </button>
              </div>
            </div>
          ))}
        </>
      ) : (
        <p>No tasks found</p>
      )}
    </div>
  );
}
