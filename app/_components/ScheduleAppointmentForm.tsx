'use client';

import { Child, Immunization, Appointment } from '@/types';
import { useRef, useState, useTransition } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, parseISO } from 'date-fns';
import 'react-day-picker/dist/style.css';
import { scheduleAppointment } from '../_lib/actions';

type Value = Date | null;

export default function ScheduleAppointmentForm({
  immunization,
  childData,
}: {
  immunization: Immunization;
  childData: Child;
}) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const dueDate = parseISO(immunization.due_date);

  const handleDateChange = (value: Value) => {
    if (value) {
      setDate(value);
      if (dateInputRef.current) {
        dateInputRef.current.value = format(value, 'yyyy-MM-dd');
      }
    }
  };

  const handleScheduleAppointment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!date) return;

    const appointmentData: Appointment = {
      child_id: childData.id!,
      hospital_id: childData.hospital_id,
      immunization_id: immunization.id,
      scheduled_date: format(date, 'yyyy-MM-dd'),
    };

    startTransition(() => scheduleAppointment(appointmentData));
  };

  return (
    <form onSubmit={handleScheduleAppointment} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium">
            Name
          </label>
          <input
            name="name"
            id="name"
            disabled
            defaultValue={childData.name}
            className="px-3 py-2 bg-primary-200 text-white w-full rounded-md"
          />
        </div>
        <div>
          <label htmlFor="vaccine" className="block font-medium">
            Vaccine
          </label>
          <input
            name="vaccine"
            id="vaccine"
            disabled
            defaultValue={immunization.vaccine.name}
            className="px-3 py-2 bg-primary-200 text-white w-full rounded-md"
          />
        </div>
        <div>
          <label
            htmlFor="appointmentDatePicker"
            className="block font-medium text-primary-700"
          >
            Date
          </label>
          <DayPicker
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            disabled={[{ before: dueDate }]}
            fromDate={dueDate}
            required
            className="border rounded-md p-4"
          />
          <input type="hidden" name="scheduled_date" ref={dateInputRef} />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:bg-primary-300 disabled:cursor-not-allowed"
        disabled={isPending || !date}
      >
        Schedule Appointment
      </button>
    </form>
  );
}
