'use client';

interface Task {
  _id: string;
  title: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

interface TaskListProps {
  tasks: Task[];
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
        <div
          key={task._id}
          className="flex items-center justify-between rounded-xl bg-white p-4 shadow-md"
        >
          <div>
            <p className="font-medium text-gray-900">{task.title}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              task.status === 'completed'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {task.status}
          </span>
        </div>
      ))}
    </div>
  );
}
