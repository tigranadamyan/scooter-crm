import { useDashboard } from "@/hooks";
import { Bike, Key, Battery, AlertTriangle } from "lucide-react";

export default function DashboardCards() {
  const { data: dashboard, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  if (!dashboard) return null;

  const cards = [
    {
      title: "Available",
      value: dashboard.scooters.available,
      icon: Bike,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "In Use",
      value: dashboard.scooters.in_use,
      icon: Key,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Maintenance",
      value: dashboard.scooters.maintenance,
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: "Offline",
      value: dashboard.scooters.offline,
      icon: Bike,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="overflow-hidden rounded-lg bg-white shadow"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className={`rounded-lg p-3 ${card.bg}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="rounded-lg bg-purple-100 p-3">
                <Key className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Rentals</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboard.active_rentals}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="rounded-lg bg-yellow-100 p-3">
                <Battery className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Battery</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {dashboard.average_battery}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
