'use server';

import connectDB from '@/lib/db';
import { Task } from '@/lib/models';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function createTask(formData: FormData) {
    await connectDB();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const userId = (await cookies()).get('userId')?.value;

    if (!userId) throw new Error('Unauthorized');
    if (!title) throw new Error('Title is required');

    await Task.create({
        title,
        description,
        userId,
    });

    // Clears the cache so the new task shows up immediately
    revalidatePath('/dashboard');
}
