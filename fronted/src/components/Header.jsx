import { User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export const Header = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-green-500">
          <Link to="/" className="hover:text-white transition">
            CREATEATHON
          </Link>
        </h1>
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              navigate("/dashboard");
            }}
            className="flex items-center space-x-2 hover:text-indigo-200 transition"
          >
            <User className="h-6 w-6" />
            <span>Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};
