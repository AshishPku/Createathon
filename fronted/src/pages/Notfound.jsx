import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-8xl font-extrabold text-blue-500 animate-bounce">
        404
      </h1>
      <h2 className="text-3xl font-semibold mt-4">Oops! Page Not Found</h2>
      <p className="text-gray-400 mt-2">
        The page you are looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-lg transition duration-300"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
