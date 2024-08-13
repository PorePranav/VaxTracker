import Link from 'next/link';
import { auth } from '../_lib/auth';

export default async function Navigation() {
  const session = await auth();

  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link
            href="/vaccines"
            className="hover:text-primary-700 transition-colors"
          >
            Vaccines
          </Link>
        </li>
      </ul>
    </nav>
  );
}
