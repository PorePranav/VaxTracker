import AppointmentCard from './AppointmentCard';
import { getScheduledAppointmentsHospital } from '@/app/_lib/data-service';

export default async function AppointmentsList() {
  const appointments = (await getScheduledAppointmentsHospital()) || [];

  return (
    <div className="grid gap-4">
      {appointments?.length > 0 ? (
        appointments?.map((appointment) => (
          <AppointmentCard
            key={appointment.immunization_id}
            appointment={appointment}
          />
        ))
      ) : (
        <p className="text-lg">
          You don&apos;t have any appointments scheduled currently
        </p>
      )}
    </div>
  );
}
