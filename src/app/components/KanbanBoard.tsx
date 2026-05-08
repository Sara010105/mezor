"use client";

import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { KanbanColumn } from './KanbanColumn';
import { Plus } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: 'todo' | 'inprogress' | 'done';
}

const TEAM_MEMBERS = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Design homepage mockup',
    description: 'Create initial design concepts for the new homepage',
    assignee: 'Alice',
    status: 'todo',
  },
  {
    id: '2',
    title: 'Implement authentication',
    description: 'Set up user login and registration',
    assignee: 'Bob',
    status: 'inprogress',
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all REST endpoints',
    assignee: 'Charlie',
    status: 'done',
  },
  {
    id: '4',
    title: 'Database migration',
    description: 'Update schema for new features',
    assignee: 'Diana',
    status: 'todo',
  },
  {
    id: '5',
    title: 'Code review',
    description: 'Review pull requests from last sprint',
    assignee: 'Eve',
    status: 'inprogress',
  },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignee: TEAM_MEMBERS[0] });

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      assignee: newTask.assignee,
      status: 'todo',
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', assignee: TEAM_MEMBERS[0] });
    setShowNewTaskForm(false);
  };

  const deleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'inprogress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full h-full bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-900">Team Kanban Board</h1>
            <button
              onClick={() => setShowNewTaskForm(!showNewTaskForm)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>

          {showNewTaskForm && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h3 className="font-semibold text-lg mb-3">New Task</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                <select
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {TEAM_MEMBERS.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={addTask}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Task
                  </button>
                  <button
                    onClick={() => setShowNewTaskForm(false)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KanbanColumn
              title="To Do"
              status="todo"
              tasks={todoTasks}
              moveTask={moveTask}
              deleteTask={deleteTask}
              teamMembers={TEAM_MEMBERS}
              onUpdateTask={(taskId, updates) => {
                setTasks((prevTasks) =>
                  prevTasks.map((task) =>
                    task.id === taskId ? { ...task, ...updates } : task
                  )
                );
              }}
            />
            <KanbanColumn
              title="In Progress"
              status="inprogress"
              tasks={inProgressTasks}
              moveTask={moveTask}
              deleteTask={deleteTask}
              teamMembers={TEAM_MEMBERS}
              onUpdateTask={(taskId, updates) => {
                setTasks((prevTasks) =>
                  prevTasks.map((task) =>
                    task.id === taskId ? { ...task, ...updates } : task
                  )
                );
              }}
            />
            <KanbanColumn
              title="Done"
              status="done"
              tasks={doneTasks}
              moveTask={moveTask}
              deleteTask={deleteTask}
              teamMembers={TEAM_MEMBERS}
              onUpdateTask={(taskId, updates) => {
                setTasks((prevTasks) =>
                  prevTasks.map((task) =>
                    task.id === taskId ? { ...task, ...updates } : task
                  )
                );
              }}
            />
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
