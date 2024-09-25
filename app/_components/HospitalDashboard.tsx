import { auth } from '@/app/_lib/auth';
import { getStatistics } from '@/app/_lib/data-service';
import AppointmentsList from '@/app/_components/AppointmentsList';

export default async function HospitalDashboard() {
  const session = await auth();
  if (!session) return;

  const statistics = await getStatistics(session.user.userId);
  if (!statistics) return;

  return (
    <>
      <h1 className="text-4xl font-semibold">Welcome to VaxTracker</h1>
      <p className="text-xl">
        Manage your patients, dashboard, and immunizations
      </p>

      <div className="mt-4">
        <div className="grid grid-cols-4 gap-8">
          {renderStatistic(statistics.childrenCount, 'Patient', 'Patients')}
          {renderStatistic(
            statistics.todayAppointments,
            'Appointment Today',
            'Appointments Today'
          )}
          {renderStatistic(
            statistics.overdueAppointments,
            'Appointment Overdue',
            'Appointments Overdue'
          )}
          {renderStatistic(
            statistics.upcomingAppointments,
            'Upcoming Appointment',
            'Upcoming Appointments'
          )}
        </div>
      </div>

      <div className="mt-4">
        <AppointmentsList />
      </div>
    </>
  );
}

function renderStatistic(count: number, singular: string, plural: string) {
  return (
    <div className="border border-primary-300 rounded-md flex flex-col items-center justify-center py-2">
      <p className="text-2xl font-semibold">{count}</p>
      <p className="text-xl">{count === 1 ? singular : plural}</p>
    </div>
  );
}
