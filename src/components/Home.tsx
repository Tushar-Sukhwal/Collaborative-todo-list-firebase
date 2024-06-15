import React, { useState } from "react";
import { Input } from "./ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import Card from "./Card";
import { useFirebase } from "@/providers/Firebase";
import { LogOut } from "lucide-react";

const Home: React.FC = () => {
  const { createTask, updateTask, deleteTask, tasks, signOut, fetchTasks } =
    useFirebase();

  fetchTasks();
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>("2023-06-30");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [newTaskPriority, setNewTaskPriority] = useState<number>(1);

  const handleTaskCompletion = async (id: string, completed: boolean) => {
    await updateTask(id, { completed: !completed });
  };

  const handleAddTask = async () => {
    if (newTaskTitle.trim() !== "") {
      const task = {
        title: newTaskTitle,
        dueDate: newTaskDueDate,
        completed: false,
        priority: newTaskPriority,
      };
      await createTask(task);
      setNewTaskTitle("");
      setNewTaskDueDate("2023-06-30");
      setNewTaskPriority(1);
    }
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
  };

  return (
    <div>
      <div className="flex justify-end">
        <button
          className="m-4 border-2 border-gray-400 p-4 shadow-md"
          onClick={signOut}
        >
          <LogOut />
        </button>
      </div>
      <div className="mx-auto max-w-md p-4 sm:p-6">
        <h1 className="mb-4 text-2xl font-bold">Todo List</h1>
        <div className="mb-4 flex items-center">
          <Input
            type="text"
            placeholder="Add a new task"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="mr-2 flex-1"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="mr-2 shadow-md">
                <CalendarDaysIcon className="mr-2 h-4 w-4" />
                {selectedDate?.toLocaleDateString()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date: Date | undefined) => setSelectedDate(date)}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleAddTask} className="shadow-md">
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {tasks.map((task) => (
            <Card
              key={task.id}
              id={task.id}
              task={task.title}
              status={task.completed ? "Complete" : "Incomplete"}
              priority={task.priority}
              dueDate={task.dueDate}
              onClick={() => handleTaskCompletion(task.id, task.completed)}
              onDelete={() => handleDeleteTask(task.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

function CalendarDaysIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}
