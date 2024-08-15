import Link from 'next/link';

function NotFound() {
  return (
    <main className="text-center space-y-6 mt-4">
      <h1 className="text-3xl font-semibold">
        This vaccine could not be found :(
      </h1>
      <Link
        href="/vaccines"
        className="inline-block bg-primary-500 rounded-lg text-white px-6 py-3 text-lg"
      >
        Go back to all vaccines
      </Link>
    </main>
  );
}

export default NotFound;
