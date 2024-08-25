import Link from 'next/link';
import { auth } from '../_lib/auth';

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
      { href: '/appointments', item: 'Appointments' },
    ];
  else if (session.user.role === 'hospital')
    links = [
      { href: '/', item: 'Dashboard' },
      { href: '/children', item: 'Children' },
    ];

  return (
    <nav className="z-10 text-xl">
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
    </nav>
  );
}
