"use client";

import { useDrop } from 'react-dnd';
import { KanbanCard } from './KanbanCard';
import type { Task } from './KanbanBoard';

interface KanbanColumnProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  moveTask: (taskId: string, newStatus: Task['status']) => void;
  deleteTask: (taskId: string) => void;
  teamMembers: string[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export function KanbanColumn({
  title,
  status,
  tasks,
  moveTask,
  deleteTask,
  teamMembers,
  onUpdateTask,
}: KanbanColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: { id: string }) => {
      moveTask(item.id, status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const columnColors = {
    todo: 'border-blue-200 bg-blue-50',
    inprogress: 'border-yellow-200 bg-yellow-50',
    done: 'border-green-200 bg-green-50',
  };

  const headerColors = {
    todo: 'bg-blue-600',
    inprogress: 'bg-yellow-600',
    done: 'bg-green-600',
  };

  return (
    <div
      ref={(node) => {
        drop(node);
      }}
      className={`rounded-lg border-2 ${columnColors[status]} ${
        isOver ? 'ring-4 ring-blue-400 ring-opacity-50' : ''
      } transition-all`}
    >
      <div className={`${headerColors[status]} text-white px-4 py-3 rounded-t-md`}>
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-sm opacity-90">{tasks.length} tasks</p>
      </div>
      <div className="p-4 space-y-3 min-h-[400px]">
        {tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            teamMembers={teamMembers}
            onUpdateTask={onUpdateTask}
          />
        ))}
      </div>
    </div>
  );
}
