import React, { useEffect, useState } from "react";
import Card from "./Card";
import { Progress } from "./ui/progress";
import { useFirebase } from "@/providers/Firebase";

const Home = () => {
  const {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    user,
    loading,
    fetchTasks,
  } = useFirebase();
  const [taskText, setTaskText] = useState("");

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const handleAddTask = async () => {
    if (taskText.trim() !== "") {
      await createTask({
        task: taskText.trim(),
        status: "pending",
        priority: 1, // Default priority, modify as needed
        dueDate: new Date().toISOString(), // Default due date, modify as needed
      });
      setTaskText(""); // Clear input after creating task
    }
  };

  const handleUpdateTask = async (taskId: string, updatedTask: any) => {
    await updateTask(taskId, updatedTask);
  };

  const pendingTasks = tasks
    .filter((task) => task.status === "pending")
    .sort((a, b) => b.priority - a.priority); // Sort in decreasing order of priority

  const completedTasks = tasks
    .filter((task) => task.status === "completed")
    .sort((a, b) => b.priority - a.priority); // Sort in decreasing order of priority

  const completedPercent: number = (completedTasks.length / tasks.length) * 100;

  return (
    <div className="h-full w-full p-10 px-48">
      <h1 className="my-5 text-center text-4xl">TO DO LIST</h1>
      <div className="mb-5">
        <Progress value={completedPercent} className="rounded-lg border-2" />
        <h1>{`completed ${completedPercent.toFixed(2)} %`}</h1>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter task"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      {pendingTasks.map((task) => (
        <Card
          key={task.id}
          {...task}
          onClick={() => handleUpdateTask(task.id, { status: "completed" })} // Update task status
          onDelete={() => deleteTask(task.id)}
        />
      ))}
      <h1 className="mb-4 mt-8 text-2xl font-bold">Completed Tasks</h1>
      {completedTasks.map((task) => (
        <Card
          key={task.id}
          {...task}
          onClick={() => handleUpdateTask(task.id, { status: "pending" })} // Update task status
          onDelete={() => deleteTask(task.id)}
        />
      ))}
    </div>
  );
};

export default Home;
