import DashboardCards from "@/features/dashboard/DashboardCards";
import DashboardCharts from "@/features/dashboard/DashboardCharts";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <DashboardCards />
      <DashboardCharts />
    </div>
  );
}
