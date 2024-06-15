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
    <div className="card">
      <h3>{task}</h3>
      <p>Status: {status}</p>
      <p>Priority: {priority}</p>
      <p>Due Date: {dueDate}</p>
      <button onClick={onClick}>Toggle Status</button>
      <button onClick={onDelete}>Delete Task</button>
    </div>
  );
};

export default Card;
