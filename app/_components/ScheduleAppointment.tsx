'use client';
import Modal from '@/app/_components/Modal';
import AddChildForm from '@/app/_components/AddChildForm';
import { Child, HospitalChildRegistration, Immunization } from '@/types';
import ScheduleAppointmentForm from './ScheduleAppointmentForm';

export default function ScheduleAppointment({
  immunization,
  childData,
}: {
  immunization: Immunization;
  childData: Child;
}) {
  return (
    <Modal>
      <Modal.Open opens="immunization-form">
        <button className="py-2 px-4 bg-primary-600 w-full text-lg text-white font-semibold rounded-md mt-4">
          Schedule Appointment
        </button>
      </Modal.Open>
      <Modal.Window name="immunization-form">
        <ScheduleAppointmentForm
          immunization={immunization}
          childData={childData}
        />
      </Modal.Window>
    </Modal>
  );
}
