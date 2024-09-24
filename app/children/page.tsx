import ChildrenPageHospital from '../_components/ChildrenPageHospital';
import ChildrenPageParent from '../_components/ChildrenPageParent';
import { auth } from '../_lib/auth';

export default async function ChildrenPage() {
  const session = await auth();
  if (!session) return;

  return (
    <>
      {session.user.role === 'parent' ? (
        <ChildrenPageParent />
      ) : (
        <ChildrenPageHospital />
      )}
    </>
  );
}
