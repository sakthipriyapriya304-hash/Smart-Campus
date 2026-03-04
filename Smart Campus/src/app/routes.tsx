import { createBrowserRouter } from "react-router";
import { AuthLayout } from "./components/layouts/AuthLayout";
import { MainLayout } from "./components/layouts/MainLayout";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { NetworkingPage } from "./pages/NetworkingPage";
import { MessagesPage } from "./pages/MessagesPage";
import { SkillsPage } from "./pages/SkillsPage";
import { OpportunitiesPage } from "./pages/OpportunitiesPage";
import { ProfilePage } from "./pages/ProfilePage";
import { NotificationsPage } from "./pages/NotificationsPage";

export const router = createBrowserRouter([
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
    ],
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "networking", Component: NetworkingPage },
      { path: "messages", Component: MessagesPage },
      { path: "skills", Component: SkillsPage },
      { path: "opportunities", Component: OpportunitiesPage },
      { path: "profile", Component: ProfilePage },
      { path: "notifications", Component: NotificationsPage },
    ],
  },
]);
