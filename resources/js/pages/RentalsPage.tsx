import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRentals, useCreateRental, useCompleteRental } from "@/hooks";
import { useAuth } from "@/contexts/AuthContext";
import { userApi, scooterApi } from "@/services/api";
import type { Rental } from "@/types";
import RentalTable from "@/features/rentals/RentalTable";
import RentalForm from "@/features/rentals/RentalForm";
import SearchInput from "@/components/SearchInput";
import Pagination from "@/components/Pagination";
import { Plus, Filter } from "lucide-react";

export default function RentalsPage() {
  const { can } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useRentals({
    search,
    status,
    page,
    per_page: 15,
  });

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: () => userApi.list(),
    select: (data) => data.data.data,
  });

  const { data: scootersData } = useQuery({
    queryKey: ["scooters-available"],
    queryFn: () => scooterApi.list({ status: "available", per_page: 100 }),
    select: (data) => data.data.data,
  });

  const createMutation = useCreateRental();
  const completeMutation = useCompleteRental();

  const handleCreate = (formData: { user_id: number; scooter_id: number }) => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        setShowForm(false);
      },
    });
  };

  const handleComplete = (rental: Rental) => {
    if (confirm(`Complete rental #${rental.id}?`)) {
      completeMutation.mutate(rental.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Rentals</h1>
        {can("rentals.create") && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Rental
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by user, scooter, phone..."
          className="flex-1"
        />
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-lg bg-gray-200" />
      ) : data ? (
        <>
          <RentalTable data={data} onComplete={handleComplete} />
          <Pagination
            currentPage={data.meta.current_page}
            lastPage={data.meta.last_page}
            onPageChange={setPage}
          />
        </>
      ) : null}

      {showForm && (
        <RentalForm
          users={usersData || []}
          scooters={scootersData || []}
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
          isLoading={createMutation.isPending}
        />
      )}
    </div>
  );
}
