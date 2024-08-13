'use client';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

const ErrorComponent: React.FC<ErrorProps> = function ({ error, reset }) {
  return (
    <main className="flex justify-center items-center flex-col gap-6">
      <h1 className="text-3xl font-semibold">Something went wrong!</h1>
      <p className="text-lg">{error.message}</p>

      <button
        className="inline-block bg-primary-500 rounded-lg text-white px-6 py-3 text-lg"
        onClick={reset}
      >
        Try again
      </button>
    </main>
  );
};

export default ErrorComponent;
