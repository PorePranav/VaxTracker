'use client';

import { createChild } from '@/app/_lib/actions';
import { HospitalChildRegistration } from '@/types';
import { useTransition } from 'react';

export default function AddChildForm({
  hospitalList,
}: {
  hospitalList: HospitalChildRegistration[] | undefined;
}) {
  const [isPending, startTransition] = useTransition();

  function handleAddChild(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    startTransition(() => {
      createChild(formData);
    });
  }

  return (
    <form onSubmit={handleAddChild}>
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <label htmlFor="name">Name</label>
          <input
            name="name"
            id="name"
            className="px-5 py-3 bg-primary-200 text-white w-full shadow-sm rounded-sm outline-none"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="date_of_birth">Birth Date</label>
          <input
            name="date_of_birth"
            id="date_of_birth"
            type="date"
            className="px-5 py-3 bg-primary-200 text-white w-full shadow-sm rounded-sm outline-none"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="gender">Gender</label>
          <select
            name="gender"
            id="gender"
            className="px-5 py-3 bg-primary-200 text-white w-full shadow-sm rounded-sm outline-none"
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="hospitalId">Hospital</label>
          <select
            name="hospital_id"
            id="hospital_id"
            className="px-5 py-3 bg-primary-200 text-white w-full shadow-sm rounded-sm outline-none"
            required
          >
            <option value={'Select'}>Select...</option>
            {hospitalList?.map((hospital) => (
              <option key={hospital.id} value={hospital.id}>
                {hospital.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        className="bg-primary-600 hover:bg-primary-800 rounded-lg px-8 py-4 text-white font-semibold  transition-all disabled:cursor-not-allowed disabled:bg-primary-900 disabled:text-gray-300 mt-6"
        disabled={isPending}
      >
        Add Child
      </button>
    </form>
  );
}
