import ChildrenList from '../_components/ChildrenList';
import { auth } from '../_lib/auth';
import { getChildren } from '../_lib/data-service';

export default async function ChildrenPage() {
  const session = await auth();
  let childrenList;
  if (session?.user.userId)
    childrenList = await getChildren(session?.user.userId);

  return (
    <>
      <h1 className="text-4xl font-semibold">Children&apos;s Profile</h1>
      {childrenList && childrenList.length > 0 && (
        <ChildrenList childrenList={childrenList} />
      )}
    </>
  );
}
