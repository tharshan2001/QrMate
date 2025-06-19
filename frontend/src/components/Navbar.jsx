import { useState, useEffect } from "react";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
        <a href="/" className="flex items-center">
          <span className="mr-2">🔗</span>
          QRMate
        </a>
      </div>

      {isAuthenticated ? (
        <button
          onClick={handleSignOut}
          className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Sign Out
        </button>
      ) : (
        <a
          href="/login"
          className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Sign In
        </a>
      )}
    </nav>
  );
}