import type { Scooter, PaginatedResponse } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/utils";
import { Pencil, Trash2, MapPin } from "lucide-react";

interface ScooterTableProps {
  data: PaginatedResponse<Scooter>;
  onEdit: (scooter: Scooter) => void;
  onDelete: (scooter: Scooter) => void;
}

export default function ScooterTable({ data, onEdit, onDelete }: ScooterTableProps) {
  const { can } = useAuth();

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Model
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Battery
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Updated
            </th>
            {(can("scooters.update") || can("scooters.delete")) && (
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.data.map((scooter) => (
            <tr key={scooter.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {scooter.number}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {scooter.model}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <StatusBadge
                  status={scooter.status}
                  label={scooter.status_label}
                />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-16 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${scooter.battery_level}%` }}
                    />
                  </div>
                  {scooter.battery_level}%
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                  {scooter.latitude.toFixed(4)}, {scooter.longitude.toFixed(4)}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {formatDate(scooter.last_updated_at)}
              </td>
              {(can("scooters.update") || can("scooters.delete")) && (
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  {can("scooters.update") && (
                    <button
                      onClick={() => onEdit(scooter)}
                      className="mr-2 text-blue-600 hover:text-blue-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                  {can("scooters.delete") && (
                    <button
                      onClick={() => onDelete(scooter)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
