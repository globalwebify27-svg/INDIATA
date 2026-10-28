import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import DashboardPage from "./pages/DashboardPage";

type Page = "login" | "create-account" | "dashboard";

export default function App() {
  const [page, setPage] = useState<Page>("login");

  const navigate = (target: Page) => setPage(target);

  if (page === "create-account") {
    return <CreateAccountPage onNavigate={navigate} />;
  }
  if (page === "dashboard") {
    return <DashboardPage onNavigate={navigate} />;
  }
  return <LoginPage onNavigate={navigate} />;
}
