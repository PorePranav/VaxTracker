'use client';

import { Session } from 'next-auth';
import { updateProfile } from '../_lib/actions';
import { useTransition } from 'react';

interface ExtendedSession extends Session {
  user: {
    userId: string;
    role: string;
    email: string;
    name?: string;
  };
}

export default function CompleteProfileForm({
  session,
}: {
  session: ExtendedSession | null;
}) {
  const [isPending, startTransition] = useTransition();

  function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(() => updateProfile(formData));
  }

  return (
    <>
      <div className="mt-4 max-w-[50%]">
        <form onSubmit={handleUpdateProfile}>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <label htmlFor="name">Name</label>
              <input
                name="name"
                id="name"
                defaultValue={session?.user.name!}
                className="px-5 py-3 bg-primary-200 text-white w-full shadow-sm rounded-sm outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="role">Role</label>
              <select
                name="role"
                id="role"
                className="px-5 py-3 bg-primary-200 text-white w-full shadow-sm rounded-sm outline-none"
                required
              >
                <option value="hospital">Hospital</option>
                <option value="parent">Parent</option>
              </select>
            </div>
          </div>
          <button
            className="bg-primary-600 hover:bg-primary-800 rounded-lg px-8 py-4 text-white font-semibold  transition-all disabled:cursor-not-allowed disabled:bg-primary-900 disabled:text-gray-300 mt-6"
            disabled={isPending}
          >
            Update Profile
          </button>
        </form>
      </div>
    </>
  );
}
