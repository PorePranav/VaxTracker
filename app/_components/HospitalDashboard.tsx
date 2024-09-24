import { auth } from '@/app/_lib/auth';
import { getScheduledAppointmentsHospital } from '@/app/_lib/data-service';
import AppointmentsList from '@/app/_components/AppointmentsList';

export default async function HospitalDashboard() {
  const session = await auth();
  const appointments = await getScheduledAppointmentsHospital();

  return (
    <>
      <h1 className="text-4xl font-semibold">Welcome to VaxTracker</h1>
      <p className="text-xl">
        Mange your patients, dashboard, and immunizations
      </p>
      <div className="mt-4">
        <div className="grid grid-cols-4 gap-8">
          <div className="border  border-primary-300 rounded-md flex flex-col items-center justify-center py-2">
            <p className="text-2xl font-semibold">23</p>
            <p className="text-xl">Patients</p>
          </div>
          <div className="border border-primary-300 rounded-md flex flex-col items-center justify-center py-2">
            <p className="text-2xl font-semibold">23</p>
            <p className="text-xl">Patients</p>
          </div>
          <div className="border border-primary-300 rounded-md flex flex-col items-center justify-center py-2">
            <p className="text-2xl font-semibold">23</p>
            <p className="text-xl">Patients</p>
          </div>
          <div className="border border-primary-300 rounded-md flex flex-col items-center justify-center py-2">
            <p className="text-2xl font-semibold">23</p>
            <p className="text-xl">Patients</p>
          </div>
        </div>
        <div className="border mt-4 border-primary-300 rounded-md flex flex-col items-center justify-center py-2">
          <p className="text-2xl font-semibold">100%</p>
          <p className="text-xl">Immunization Rate</p>
        </div>
        <div className="mt-6">
          <p className="text-2xl font-semibold">Upcoming Appointments</p>
        </div>
      </div>
      <div className="mt-4">
        <AppointmentsList />
      </div>
    </>
  );
}
