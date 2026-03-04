import { Outlet, Navigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";

export function AuthLayout() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="icon"
          className="rounded-full backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border-white/50"
        >
          {theme === "light" ? <Moon className="size-5" /> : <Sun className="size-5" />}
        </Button>
      </div>
      <Outlet />
    </div>
  );
}
