'use client';

import { updateChild } from '@/app/_lib/actions';
import { Child, HospitalChildRegistration } from '@/types';
import { useTransition } from 'react';

export default function AddChildForm({
  hospitalList,
  childData,
}: {
  hospitalList: HospitalChildRegistration[] | undefined;
  childData: Child;
}) {
  const [isPending, startTransition] = useTransition();

  function handleEditChild(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    startTransition(() => {
      updateChild(childData.id!, formData);
    });
  }

  return (
    <form onSubmit={handleEditChild}>
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <label htmlFor="name">Name</label>
          <input
            name="name"
            id="name"
            defaultValue={childData.name}
            className="px-5 py-3 bg-primary-200 text-white w-full shadow-sm rounded-sm outline-none"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="hospitalId">Hospital</label>
          <select
            name="hospital_id"
            id="hospital_id"
            defaultValue={childData.hospital_id}
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
        Edit Child
      </button>
    </form>
  );
}
