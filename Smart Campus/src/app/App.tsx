import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DataProvider } from "./contexts/DataContext";
import { Toaster } from "./components/ui/sonner";
import { useEffect } from "react";
import { initializeMockData } from "./utils/initializeMockData";

export default function App() {
  useEffect(() => {
    // Initialize mock data on first load
    initializeMockData();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}