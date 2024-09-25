'use client';

import { useTransition } from 'react';
import { markAsCompleted } from '@/app/_lib/actions';

export default function CompletionForm({
  immunizationId,
  hospitalId,
}: {
  immunizationId: string;
  hospitalId: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleCompletion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(() => {
      markAsCompleted(immunizationId, hospitalId);
    });
  }

  return (
    <form onSubmit={handleCompletion}>
      <button
        className="px-4 py-2 w-full text-lg bg-primary-600 hover:bg-primary-800 transition-colors text-white rounded-md text-bold"
        disabled={isPending}
      >
        Mark As Completed
      </button>
    </form>
  );
}
