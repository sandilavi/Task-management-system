import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
        Manage Tasks <span className="text-indigo-600">Smarter.</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-gray-600">
        The Ultimate Task Management System. 
        Organize your work, stay secure, and hit your deadlines.
      </p>
      <div className="mt-10 flex gap-4">
        <Link href="/login" className="rounded-md bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-500">
          Get Started
        </Link>
        <Link href="/register" className="rounded-md border border-gray-300 px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50">
          Create Account
        </Link>
      </div>
    </div>
  );
}
