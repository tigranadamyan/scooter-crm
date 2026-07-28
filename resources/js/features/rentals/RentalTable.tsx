import type { Rental, PaginatedResponse } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/utils";
import { CheckCircle, User, Bike } from "lucide-react";

interface RentalTableProps {
  data: PaginatedResponse<Rental>;
  onComplete: (rental: Rental) => void;
}

export default function RentalTable({ data, onComplete }: RentalTableProps) {
  const { can } = useAuth();

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Scooter
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Start Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              End Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Status
            </th>
            {can("rentals.complete") && (
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.data.map((rental) => (
            <tr key={rental.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                #{rental.id}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-gray-400" />
                  {rental.user?.name || "—"}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Bike className="mr-2 h-4 w-4 text-gray-400" />
                  {rental.scooter?.number || "—"}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {formatDate(rental.start_time)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {formatDate(rental.end_time)}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <StatusBadge
                  status={rental.status}
                  label={rental.status_label}
                />
              </td>
              {can("rentals.complete") && (
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  {rental.status === "active" && (
                    <button
                      onClick={() => onComplete(rental)}
                      className="inline-flex items-center text-green-600 hover:text-green-900"
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Complete
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
