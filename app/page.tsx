"use client";

import { useAuth } from "@/context/AuthContext";
import Dashboard from "@/components/dashboard/Dashboard";
import LoginPage from "@/app/login/page";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Dashboard /> : <LoginPage />;
}
