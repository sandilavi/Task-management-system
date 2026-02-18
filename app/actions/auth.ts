'use server';

import connectDB from '@/lib/db';
import { User } from '@/lib/models';
import { checkRateLimit } from '@/lib/rate-limit';
import bcrypt from 'bcryptjs';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Auth code for registration
export async function register(prevState: any, formData: FormData) {
    // Rate limit: max 10 registration attempts per IP per hour
    const ip = (await headers()).get('x-forwarded-for') ?? 'unknown';
    const { blocked } = checkRateLimit(ip, { maxAttempts: 10, windowMs: 60 * 60 * 1000 });
    if (blocked) return { error: 'Too many attempts. Please try again later.' };

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
    // Rate limit: max 5 login attempts per IP per 15 minutes
    const ip = (await headers()).get('x-forwarded-for') ?? 'unknown';
    const { blocked } = checkRateLimit(ip, { maxAttempts: 5, windowMs: 15 * 60 * 1000 });
    if (blocked) return { error: 'Too many login attempts. Please try again in 15 minutes.' };

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
