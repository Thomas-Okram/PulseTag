import { useAuthStore } from "../store/authStore";
import AdminDashboard from "./AdminDashboardPage";
import UserDashboard from "./UserDashboardPage";
import { useState, useEffect } from "react";

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      setLoading(false); // Stop loading once the user is available
    }
  }, [user, isAuthenticated]);

  if (loading)
    return <p className="text-white text-center mt-10">Loading...</p>;

  return user.role === "admin" ? <AdminDashboard /> : <UserDashboard />;
};

export default DashboardPage;
