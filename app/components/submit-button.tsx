'use client';

import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  label: string;
  pendingLabel: string;
  className?: string;
}

export default function SubmitButton({ label, pendingLabel, className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition ${className}`}
    >
      {pending && (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {pending ? pendingLabel : label}
    </button>
  );
}
