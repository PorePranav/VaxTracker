import AddChild from '../_components/AddChild';
import ChildrenList from '../_components/ChildrenList';
import { auth } from '../_lib/auth';
import { getChildren, getHospitals } from '../_lib/data-service';

export default async function ChildrenPage() {
  const session = await auth();
  let childrenList;
  if (session?.user.userId)
    childrenList = await getChildren(session?.user.userId);
  const hospitalList = await getHospitals();

  return (
    <>
      <h1 className="text-4xl font-semibold">Children&apos;s Profile</h1>
      <AddChild hospitalList={hospitalList} />
      {childrenList && childrenList.length > 0 ? (
        <ChildrenList childrenList={childrenList} />
      ) : (
        <p className="mt-4 text-xl">
          You have not added any children yet, start by clicking on the above
          button!
        </p>
      )}
    </>
  );
}
