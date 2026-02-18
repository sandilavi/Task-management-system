'use client';

import { updateTaskStatus, updateTaskTitle, deleteTask } from '@/app/actions/tasks';
import SubmitButton from '@/app/components/submit-button';
import { useState } from 'react';

interface Task {
  _id: string;
  title: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

interface TaskListProps {
  tasks: Task[];
}

function TaskItem({ task }: { task: Task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);

  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-md gap-4">
      {/* Left: status badge + title / edit input */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            task.status === 'completed'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {task.status}
        </span>

        {isEditing ? (
          /* Inline edit form */
          <form
            action={updateTaskTitle}
            onSubmit={() => setIsEditing(false)}
            className="flex flex-1 gap-2 min-w-0"
          >
            <input type="hidden" name="taskId" value={task._id} />
            <input
              name="title"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              required
              autoFocus
              className="flex-1 rounded-md border border-indigo-400 px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <SubmitButton
              label="Save"
              pendingLabel="Saving..."
              className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-500"
            />
            <button
              type="button"
              onClick={() => { setIsEditing(false); setEditValue(task.title); }}
              className="rounded-md bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </form>
        ) : (
          /* Display title */
          <p
            className={`font-medium text-gray-900 truncate ${
              task.status === 'completed' ? 'line-through text-gray-400' : ''
            }`}
          >
            {task.title}
          </p>
        )}
      </div>

      {/* Right: action buttons (hidden while editing) */}
      {!isEditing && (
        <div className="flex items-center gap-2 shrink-0">
          {/* Edit title */}
          <button
            onClick={() => setIsEditing(true)}
            title="Edit title"
            className="rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition"
          >
            ✏️ Edit
          </button>

          {/* Toggle status */}
          <form action={updateTaskStatus}>
            <input type="hidden" name="taskId" value={task._id} />
            <input type="hidden" name="currentStatus" value={task.status} />
            <SubmitButton
              label={task.status === 'completed' ? '↩ Undo' : '✓ Complete'}
              pendingLabel="..."
              className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                task.status === 'completed'
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            />
          </form>

          {/* Delete */}
          <form action={deleteTask}>
            <input type="hidden" name="taskId" value={task._id} />
            <SubmitButton
              label="🗑 Delete"
              pendingLabel="..."
              className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-200"
            />
          </form>
        </div>
      )}
    </div>
  );
}

export default function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 shadow-lg text-center">
        <p className="text-gray-400 italic">No tasks found. Start by creating one above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} />
      ))}
    </div>
  );
}
