import Link from 'next/link';

export default async function Navigation() {
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
