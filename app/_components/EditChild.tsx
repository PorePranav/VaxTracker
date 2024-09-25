'use client';
import Modal from '@/app/_components/Modal';
import { Child, HospitalChildRegistration } from '@/types';
import EditChildForm from '@/app/_components/EditChildForm';

export default function EditChild({
  hospitalList,
  childData,
}: {
  hospitalList: HospitalChildRegistration[] | undefined;
  childData: Child;
}) {
  return (
    <Modal>
      <Modal.Open opens="child-form">
        <button className="py-2 px-4 bg-primary-600 text-white font-semibold rounded-md w-full">
          Edit Details
        </button>
      </Modal.Open>
      <Modal.Window name="child-form">
        <EditChildForm hospitalList={hospitalList} childData={childData} />
      </Modal.Window>
    </Modal>
  );
}
