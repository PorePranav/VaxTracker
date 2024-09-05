import Link from 'next/link';

function NotFound() {
  return (
    <main className="text-center space-y-6 mt-4">
      <h1 className="text-3xl font-semibold">
        Child details could not be found :(
      </h1>
      <Link
        href="/children"
        className="inline-block bg-primary-500 rounded-lg text-white px-6 py-3 text-lg"
      >
        Go back
      </Link>
    </main>
  );
}

export default NotFound;
