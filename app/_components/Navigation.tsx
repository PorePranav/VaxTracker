import Link from 'next/link';
import { auth } from '../_lib/auth';
import { signOutAction } from '../_lib/actions';

export default async function Navigation() {
  const session = await auth();

  let links: { href: string; item: string }[] | undefined;
  if (session === null)
    links = [
      { href: '/vaccines', item: 'Vaccines' },
      { href: '/login', item: 'Login' },
    ];
  else if (session.user.role === 'parent')
    links = [
      { href: '/', item: 'Dashboard' },
      { href: '/vaccines', item: 'Vaccines' },
      { href: '/children', item: 'Children' },
    ];
  else if (session.user.role === 'hospital')
    links = [
      { href: '/', item: 'Dashboard' },
      { href: '/children', item: 'Children' },
    ];

  return (
    <nav className="z-10 text-xl">
      <div className="flex">
        <ul className="flex gap-8 items-center">
          {links?.map((link) => (
            <li key={link.item}>
              <Link
                href={link.href}
                className="hover:text-primary-700 transition-colors"
              >
                {link.item}
              </Link>
            </li>
          ))}
        </ul>
        {session && (
          <form action={signOutAction} className="ml-8">
            <button className="hover:text-white px-4 py-2 rounded-md transition-colors hover:bg-primary-700">
              Logout
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}
