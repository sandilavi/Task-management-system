'use server';

import connectDB from '@/lib/db';
import { User } from '@/lib/models';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Auth code for registration
export async function register(prevState: any, formData: FormData) {
    await connectDB();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
        return { error: 'Please fill in all fields' };
    }

    // Check if the user exists
    const userExists = await User.findOne({ email });
    if (userExists) return { error: 'User already exists' };

    // Hash the password before saving it on DB
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    // Set session cookie
    (await cookies()).set('userId', user._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 2, // 2 hours
        path: '/',
    });

    redirect('/dashboard');
}


// Auth code for login
export async function login(prevState: any, formData: FormData) {
    await connectDB();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Please fill in all fields' };
    }

    // Find the user
    const user = await User.findOne({ email });

    if (!user) {
        return { error: 'Invalid credentials' };
    }

    // Compare passwords (security check)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return { error: 'Invalid credentials' };
    }

    // Set session cookie
    (await cookies()).set('userId', user._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 2,
        path: '/',
    });

    redirect('/dashboard');
}


// Auth code for logout
export async function logout() {
  (await cookies()).delete('userId');
  redirect('/login');
}
