'use client';
import Modal from '@/app/_components/Modal';
import AddChildForm from '@/app/_components/AddChildForm';
import { HospitalChildRegistration } from '@/types';

export default function AddChild({
  hospitalList,
}: {
  hospitalList: HospitalChildRegistration[] | undefined;
}) {
  return (
    <Modal>
      <Modal.Open opens="child-form">
        <button className="py-2 px-4 bg-primary-600 text-white font-semibold rounded-md mt-4">
          Add New Child
        </button>
      </Modal.Open>
      <Modal.Window name="child-form">
        <AddChildForm hospitalList={hospitalList} />
      </Modal.Window>
    </Modal>
  );
}
