import { useState } from "react";
import type { User, Scooter } from "@/types";
import { X, User as UserIcon, Bike } from "lucide-react";

interface RentalFormProps {
  users: User[];
  scooters: Scooter[];
  onSubmit: (data: { user_id: number; scooter_id: number }) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function RentalForm({ users, scooters, onSubmit, onClose, isLoading }: RentalFormProps) {
  const [userId, setUserId] = useState<number>(0);
  const [scooterId, setScooterId] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId && scooterId) {
      onSubmit({ user_id: userId, scooter_id: scooterId });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create Rental</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">User</label>
            <select
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={0}>Select user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.phone || user.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Scooter</label>
            <select
              value={scooterId}
              onChange={(e) => setScooterId(Number(e.target.value))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={0}>Select scooter...</option>
              {scooters.map((scooter) => (
                <option key={scooter.id} value={scooter.id}>
                  {scooter.number} - {scooter.model} (Battery: {scooter.battery_level}%)
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !userId || !scooterId}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Rental"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
