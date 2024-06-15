import React from "react";

export interface CardProps {
  id: string;
  task: string;
  status: string;
  priority: number;
  dueDate: string;
  onClick: () => void;
  onDelete: () => void;
}

const Card: React.FC<CardProps> = ({
  task,
  status,
  priority,
  dueDate,
  onClick,
  onDelete,
}) => {
  return (
    <div className="card flex items-center justify-between rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
      <div>
        <h3 className="font-medium">{task}</h3>
        <p>Status: {status}</p>
        <p>Priority: {priority}</p>
        <p>Due Date: {dueDate}</p>
      </div>
      <div className="flex space-x-2">
        <button
          className="rounded bg-blue-500 px-3 py-1 text-white shadow-md hover:bg-blue-700"
          onClick={onClick}
        >
          Toggle Status
        </button>
        <button
          className="rounded bg-red-500 px-3 py-1 text-white shadow-md hover:bg-red-700"
          onClick={onDelete}
        >
          Delete Task
        </button>
      </div>
    </div>
  );
};

export default Card;
