'use client';

import { updateTaskStatus, updateTaskTitle, deleteTask } from '@/app/actions/tasks';
import SubmitButton from '@/app/components/submit-button';
import { useRef, useState } from 'react';

interface Task {
  _id: string;
  title: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

interface TaskListProps {
  tasks: Task[];
}

// Delete confirmation modal
function DeleteModal({
  taskTitle,
  onConfirm,
  onCancel,
}: {
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
        <h3 className="text-lg font-bold text-gray-900">Delete Task?</h3>
        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-800">&quot;{taskTitle}&quot;</span>?
          This action cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskItem({ task }: { task: Task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteFormRef = useRef<HTMLFormElement>(null);

  return (
    <>
      {showDeleteModal && (
        <DeleteModal
          taskTitle={task.title}
          onConfirm={() => {
            setShowDeleteModal(false);
            deleteFormRef.current?.requestSubmit();
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

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
                maxLength={200}
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

            {/* Delete — triggers modal, form submits only on confirm */}
            <form action={deleteTask} ref={deleteFormRef}>
              <input type="hidden" name="taskId" value={task._id} />
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-200 transition"
              >
                🗑 Delete
              </button>
            </form>
          </div>
        )}
      </div>
    </>
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
