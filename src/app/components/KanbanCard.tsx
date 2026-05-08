"use client";

import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { User, Trash2, Edit2, Check, X } from 'lucide-react';
import type { Task } from './KanbanBoard';

interface KanbanCardProps {
  task: Task;
  deleteTask: (taskId: string) => void;
  teamMembers: string[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export function KanbanCard({ task, deleteTask, teamMembers, onUpdateTask }: KanbanCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedAssignee, setEditedAssignee] = useState(task.assignee);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleSave = () => {
    onUpdateTask(task.id, {
      title: editedTitle,
      description: editedDescription,
      assignee: editedAssignee,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedAssignee(task.assignee);
    setIsEditing(false);
  };

  const assigneeColors = [
    'bg-purple-100 text-purple-700',
    'bg-pink-100 text-pink-700',
    'bg-indigo-100 text-indigo-700',
    'bg-cyan-100 text-cyan-700',
    'bg-orange-100 text-orange-700',
  ];

  const assigneeIndex = teamMembers.indexOf(task.assignee) % assigneeColors.length;

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border-2 border-blue-400">
        <div className="space-y-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
          />
          <select
            value={editedAssignee}
            onChange={(e) => setEditedAssignee(e.target.value)}
            className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {teamMembers.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              <Check size={14} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 px-3 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 text-sm"
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={(node) => {
        drag(node);
      }}
      className={`bg-white rounded-lg shadow-md p-4 cursor-move hover:shadow-lg transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-slate-900">{task.title}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="text-slate-400 hover:text-blue-600 transition-colors p-1"
            title="Edit task"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="text-slate-400 hover:text-red-600 transition-colors p-1"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <p className="text-sm text-slate-600 mb-3">{task.description}</p>
      <div className="flex items-center gap-2">
        <User size={16} className="text-slate-400" />
        <span className={`text-xs px-2 py-1 rounded-full ${assigneeColors[assigneeIndex]}`}>
          {task.assignee}
        </span>
      </div>
    </div>
  );
}
