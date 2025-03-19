import { Navigate } from "react-router-dom";
import api from "@/api";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children }) {
  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refresh");
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem("access", res.data.access);
        setIsAuthorized(true);
      }
    } catch (err) {
      console.log(err);
      setIsAuthorized(false);
    }
  };
  const auth = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;
    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };
  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }
  return isAuthorized ? children : <Navigate to="/login" />;
}
export default ProtectedRoute;
