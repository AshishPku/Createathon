import { BarChart2, Clock, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const DashBoard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) throw new Error("No token found");
        const decoded = jwtDecode(token);
        const userId = decoded.user_id;
        const userResponse = await axios.get(
          `http://127.0.0.1:8000/api/auth/users/${userId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(userResponse.data);
        const submissionsResponse = await axios.get(
          "http://127.0.0.1:8000/api/auth/submissions/user/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const submissionData = await Promise.all(
          submissionsResponse.data.submissions.map(async (sub) => {
            try {
              const questionResponse = await axios.get(
                `http://127.0.0.1:8000/api/auth/questions/${sub.question_id}/`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              return {
                id: sub.id,
                challenge: questionResponse.data.title,
                date: new Date(sub.submitted_at).toLocaleString(),
                status:
                  sub.status.charAt(0).toUpperCase() + sub.status.slice(1),
                feedback: "Pending review", // Add real feedback if available
              };
            } catch (error) {
              console.error(
                `Error fetching question ${sub.question_id}:`,
                error
              );
              return {
                id: sub.id,
                challenge: `Question ${sub.question_id} (Title unavailable)`,
                date: new Date(sub.submitted_at).toLocaleString(),
                status:
                  sub.status.charAt(0).toUpperCase() + sub.status.slice(1),
                feedback: "Pending review",
              };
            }
          })
        );

        setSubmissions(submissionData);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading)
    return <p className="text-center text-gray-700">Loading dashboard...</p>;

  return (
    <section id="dashboard" className="bg-gray-200 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold flex items-center text-violet-700">
          <BarChart2 className="mr-2" />
          {userData?.username}'s Dashboard, userId:{userData?.id}
        </h3>
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-700 p-4 rounded-md text-center">
          <h4 className="text-lg font-medium mb-2 text-white">Progress</h4>
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-gray-400"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-violet-700"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 12 6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${
                  userData
                    ? (userData.no_of_questions_solved /
                        (userData.attempted_questions || 1)) *
                      100
                    : 0
                }, 100`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
              {userData
                ? Math.round(
                    (userData.no_of_questions_solved /
                      (userData.attempted_questions || 1)) *
                      100
                  )
                : 0}
              %
            </div>
          </div>
        </div>
        <div className="bg-gray-700 p-4 rounded-md">
          <h4 className="text-lg font-medium mb-2 text-white">Challenges</h4>
          <p className="text-gray-300">
            Completed:{" "}
            <span className="text-green-400">
              {userData?.no_of_questions_solved || 0}
            </span>
          </p>
          <p className="text-gray-300">
            Attempted:{" "}
            <span className="text-yellow-400">
              {userData?.attempted_questions || 0}
            </span>
          </p>
        </div>
        <div className="bg-gray-700 p-4 rounded-md">
          <h4 className="text-lg font-medium mb-2 text-white">Achievements</h4>
          <div className="flex space-x-2">
            {userData?.badges_earned > 0 ? (
              <>
                <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-sm">
                  Beginner
                </span>
                {userData.badges_earned > 1 && (
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                    Problem Solver
                  </span>
                )}
              </>
            ) : (
              <p className="text-gray-400 text-sm">No achievements yet</p>
            )}
          </div>
          <p className="text-gray-300 mt-2">
            Points:{" "}
            <span className="text-purple-400">
              {userData?.earned_points || 0}
            </span>
          </p>
        </div>
      </div>

      <div className="bg-gray-700 p-6 rounded-md shadow-inner">
        <h4 className="text-lg font-medium mb-4 text-white flex items-center">
          <Clock className="mr-2" /> Submission History
        </h4>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {submissions.length > 0 ? (
            submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-gray-800 p-4 rounded-md hover:bg-gray-600 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <h5 className="text-md font-semibold text-white">
                    {submission.challenge}
                  </h5>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      submission.status === "Accepted"
                        ? "bg-green-500 text-black"
                        : submission.status === "Rejected"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500 text-black"
                    }`}
                  >
                    {submission.status}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  Submitted: {submission.date}
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  <strong>Feedback:</strong> {submission.feedback}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No submissions found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashBoard;
