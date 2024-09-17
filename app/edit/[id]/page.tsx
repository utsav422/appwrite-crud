"use client";
import { ID } from "appwrite";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

const page = ({ params }: { params: { id: string } }) => {
  const [formData, setFormData] = useState({ term: "", task: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/tasks/${params.id}`);
        if (!response.ok) {
          throw new Error("failed to fetch tasks");
        }

        const data = await response.json();
        setFormData({ term: data.task.term, task: data.task.task });
      } catch (error) {
        setError("failed to load tasks");
      }
    };

    fetchData();
  }, []);
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
      const response = await fetch(`/api/tasks/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to update task");
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
      <h2 className=" text-2xl font-bold my-8 "> EDIT TASK</h2>

      <form className=" flex gap-3 flex-col" onSubmit={handleSubmit}>
        <input
          type="text"
          name="term"
          value={formData.term}
          placeholder=" write task"
          className=" py-1 px-4 border rounded-md"
          onChange={handleInputChange}
        />

        <textarea
          className="py-1 px-4 border rounded-md resize-none"
          name="task"
          cols={30}
          rows={10}
          value={formData.task}
          onChange={handleInputChange}
        ></textarea>
        <button className=" bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer">
          {" "}
          {isLoading ? "updating..." : "update Task to List"}{" "}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default page;
