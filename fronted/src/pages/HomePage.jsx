import { Code, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [error, setError] = useState(null);
  const [loginUserId, setLoginUserId] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setLoginUserId(decoded.user_id || decoded.sub);
      } catch (err) {
        console.error("Error decoding JWT token:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/auth/questions/"
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to load questions. Showing sample data.");
        setQuestions([
          {
            id: 1,
            title: "Sample Questions",
            difficulties: "easy",
            description: "Given an array of integers...",
          },
        ]);
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/auth/users/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        const sortedUsers = response.data
          .sort((a, b) => b.earned_points - a.earned_points)
          .map((user, index) => ({
            rank: index + 1,
            name: user.username,
            points: user.earned_points,
            id: user.id,
          }));
        setLeaderboard(sortedUsers);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setError("Failed to load leaderboard. Showing sample data.");
        setLeaderboard([
          { rank: 1, name: "CodeNinja", points: 1500, id: 1 },
          { rank: 2, name: "AlgoMaster", points: 1200, id: 2 },
          { rank: 3, name: "BugBlaster", points: 900, id: 3 },
          { rank: 4, name: "SyntaxWizard", points: 800, id: 4 },
        ]);
      } finally {
        setLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <main className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8 min-h-[calc(100vh-96px)]">
        <section className="w-full md:w-1/2 bg-gray-800 rounded-lg shadow-lg p-6 overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Code className="mr-2" /> Challenges
          </h2>
          {loadingQuestions ? (
            <p className="text-gray-400">Loading challenges...</p>
          ) : (
            <ul className="space-y-4">
              {questions.map((question) => (
                <li
                  key={question.id}
                  className="bg-gray-700 p-4 rounded-md hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  <Link
                    to={`/ide/${question.id}`}
                    className="hover:text-white transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium">
                          {question.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Difficulty:{" "}
                          {question.difficulty_display || question.difficulties}
                        </p>
                        <p className="text-sm text-gray-300 mt-1">
                          {question.description.substring(0, 100)}...
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm bg-yellow-500 text-black">
                        Unsolved
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Right Half: Global Leaderboard */}
        <section className="w-full md:w-1/2 bg-gray-800 rounded-lg shadow-lg p-6 overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Trophy className="mr-2" /> Global Leaderboard
          </h2>
          {loadingLeaderboard ? (
            <p className="text-gray-400">Loading leaderboard...</p>
          ) : (
            <ul className="space-y-4">
              {leaderboard.map((entry) => (
                <li
                  key={entry.rank}
                  className={`flex justify-between items-center p-4 rounded-md hover:bg-gray-600 transition-colors ${
                    entry.id === loginUserId ? "bg-green-700" : "bg-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-yellow-400 font-bold w-6">
                      {entry.rank}
                    </span>
                    <span>{entry.name}</span>
                  </div>
                  <span className="text-indigo-400 font-semibold">
                    {entry.points} pts
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {error && (
        <div className="fixed bottom-4 left-4 bg-red-600 text-white p-4 rounded-md">
          {error}
        </div>
      )}

      <footer className="bg-gray-800 p-6 text-center text-gray-400">
        <p>© 2025 Createathon. All rights reserved.</p>
      </footer>

      <style jsx global>{`
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: #6366f1 #4b5563;
        }

        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: #4b5563;
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #6366f1;
          border-radius: 4px;
        }

        .hover\:bg-gray-600:hover {
          background-color: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
