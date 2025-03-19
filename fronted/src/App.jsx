import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import IDE from "./components/IDE";
import { Header } from "./components/Header";
import DashBoard from "./pages/DashBoard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Notfound from "./pages/Notfound";
const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("access");
  return isAuthenticated ? <Navigate to="/" /> : children;
};
function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}
const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ide/:id"
          element={
            <ProtectedRoute>
              <IDE />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterAndLogout />
            </PublicRoute>
          }
        />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </Router>
  );
};

export default App;
