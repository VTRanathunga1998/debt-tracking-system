import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/Dashboard/Dashboard";

export default function Home() {
  return (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  );
}