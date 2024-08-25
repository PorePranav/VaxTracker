import HospitalDashboard from './_components/HospitalDashboard';
import LandingPage from './_components/LandingPage';
import ParentDashboard from './_components/ParentDashboard';
import { auth } from './_lib/auth';

export default async function Home() {
  const session = await auth();

  if (!session) return <LandingPage />;
  else if (session.user.role === 'parent') return <ParentDashboard />;
  else return <HospitalDashboard />;
}
