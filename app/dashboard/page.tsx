import { logout } from '@/app/actions/auth';
import { createTask } from '@/app/actions/tasks';
import SubmitButton from '@/app/components/submit-button';
import connectDB from '@/lib/db';
import { Task } from '@/lib/models';
import { cookies } from 'next/headers';
import TaskList from './task-list';

async function getTasks() {
  // Fetching logic directly in the Server Component
  await connectDB();
  const userId = (await cookies()).get('userId')?.value;

  if (!userId) return [];

  // Only fetch tasks belonging to this specific user
  const tasks = await Task.find({ userId }).sort({ createdAt: -1 }).lean();

  // Convert Mongoose docs to plain objects for the Client Component
  return tasks.map((task: any) => ({
    _id: task._id.toString(),
    title: task.title,
    status: task.status,
    createdAt: task.createdAt.toString(),
  }));
}

export default async function DashboardPage() {
  const tasks = await getTasks();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-lg">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Tasks</h1>
            <p className="mt-1 text-sm text-gray-500">Manage and track your work</p>
          </div>
          <form action={logout}>
            <SubmitButton
              label="Logout"
              pendingLabel="Logging out..."
              className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
            />
          </form>
        </div>

        {/* Add New Task */}
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Add New Task</h2>
          <form action={createTask} className="flex flex-col gap-4 sm:flex-row">
            <input
              name="title"
              placeholder="Task title..."
              required
              className="flex-1 rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <SubmitButton
              label="Add Task"
              pendingLabel="Adding..."
              className="rounded-md bg-indigo-600 px-6 py-2 text-white font-medium hover:bg-indigo-500"
            />
          </form>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800">Your Current Tasks</h2>
          <TaskList tasks={tasks} />
        </div>

      </div>
    </div>
  );
}
