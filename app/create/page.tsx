"use client";
import React, { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [formData, setFormData] = useState({ term: "", task: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.term || !formData.task) {
      setError("Please fill all fields");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to create task");
      }
      router.push("/");
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold my-8">Add New Task</h2>

      <form className="flex gap-3 flex-col" onSubmit={handleSubmit}>
        <input
          type="text"
          name="term" // Name must match the key in formData
          value={formData.term}
          placeholder="Write task"
          className="py-1 px-4 border rounded-md"
          onChange={handleInputChange}
        />

        <textarea
          className="py-1 px-4 border rounded-md resize-none"
          name="task" // Name must match the key in formData
          value={formData.task}
          cols={30}
          rows={10}
          onChange={handleInputChange}
        ></textarea>

        <button
          className="bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer"
          type="submit"
        >
          {isLoading ? "Adding..." : "Add Task to List"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Page;
