import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <h1 className="text-4xl font-bold text-primary">404</h1>
      <p className="text-sm text-gray-500">Page not found</p>
      <Link to="/" className="text-sm font-medium text-primary underline">
        Back to home
      </Link>
    </div>
  );
}
