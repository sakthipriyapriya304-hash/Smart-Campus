import { Outlet, Navigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { Navbar } from "../Navbar";

export function MainLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
}
