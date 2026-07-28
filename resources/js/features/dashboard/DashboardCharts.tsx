import { useDashboard } from "@/hooks";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#f97316", "#ef4444"];

export default function DashboardCharts() {
  const { data: dashboard, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-80 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  if (!dashboard) return null;

  const statusData = [
    { name: "Available", value: dashboard.scooters.available },
    { name: "In Use", value: dashboard.scooters.in_use },
    { name: "Maintenance", value: dashboard.scooters.maintenance },
    { name: "Offline", value: dashboard.scooters.offline },
  ];

  const batteryData = dashboard.battery_distribution || [
    { name: "0-25%", count: 0 },
    { name: "25-50%", count: 0 },
    { name: "50-75%", count: 0 },
    { name: "75-100%", count: 0 },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Scooter Distribution by Status
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Average Battery Level
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={batteryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
