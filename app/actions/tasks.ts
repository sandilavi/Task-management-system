'use server';

import connectDB from '@/lib/db';
import { Task } from '@/lib/models';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Create a new task
export async function createTask(formData: FormData) {
    await connectDB();

    const title = formData.get('title') as string;
    const userId = (await cookies()).get('userId')?.value;

    if (!userId) throw new Error('Unauthorized');
    if (!title) throw new Error('Title is required');

    await Task.create({ title, userId });

    revalidatePath('/dashboard');
}

// Toggle task status between 'pending' and 'completed'
export async function updateTaskStatus(formData: FormData) {
    await connectDB();

    const taskId = formData.get('taskId') as string;
    const currentStatus = formData.get('currentStatus') as string;
    const userId = (await cookies()).get('userId')?.value;

    if (!userId) throw new Error('Unauthorized');

    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

    // Ensure the task belongs to the logged-in user before updating
    await Task.findOneAndUpdate(
        { _id: taskId, userId },
        { status: newStatus }
    );

    revalidatePath('/dashboard');
}

// Update task title
export async function updateTaskTitle(formData: FormData) {
    await connectDB();

    const taskId = formData.get('taskId') as string;
    const title = formData.get('title') as string;
    const userId = (await cookies()).get('userId')?.value;

    if (!userId) throw new Error('Unauthorized');
    if (!title?.trim()) throw new Error('Title is required');

    // Ensure the task belongs to the logged-in user before updating
    await Task.findOneAndUpdate(
        { _id: taskId, userId },
        { title: title.trim() }
    );

    revalidatePath('/dashboard');
}

// Delete a task
export async function deleteTask(formData: FormData) {
    await connectDB();

    const taskId = formData.get('taskId') as string;
    const userId = (await cookies()).get('userId')?.value;

    if (!userId) throw new Error('Unauthorized');

    // Ensure the task belongs to the logged-in user before deleting
    await Task.findOneAndDelete({ _id: taskId, userId });

    revalidatePath('/dashboard');
}
