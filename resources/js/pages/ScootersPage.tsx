import { useState } from "react";
import { useScooters, useCreateScooter, useUpdateScooter, useDeleteScooter } from "@/hooks";
import { useAuth } from "@/contexts/AuthContext";
import type { Scooter } from "@/types";
import ScooterTable from "@/features/scooters/ScooterTable";
import ScooterForm from "@/features/scooters/ScooterForm";
import SearchInput from "@/components/SearchInput";
import Pagination from "@/components/Pagination";
import { Plus, Filter } from "lucide-react";

export default function ScootersPage() {
  const { can } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingScooter, setEditingScooter] = useState<Scooter | undefined>();

  const { data, isLoading } = useScooters({
    search,
    status,
    page,
    per_page: 15,
  });

  const createMutation = useCreateScooter();
  const updateMutation = useUpdateScooter();
  const deleteMutation = useDeleteScooter();

  const handleCreate = (formData: any) => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        setShowForm(false);
      },
    });
  };

  const handleUpdate = (formData: any) => {
    if (editingScooter) {
      updateMutation.mutate(
        { id: editingScooter.id, data: formData },
        {
          onSuccess: () => {
            setEditingScooter(undefined);
          },
        }
      );
    }
  };

  const handleDelete = (scooter: Scooter) => {
    if (confirm(`Delete scooter ${scooter.number}?`)) {
      deleteMutation.mutate(scooter.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Scooters</h1>
        {can("scooters.create") && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Scooter
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by number or model..."
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
            <option value="available">Available</option>
            <option value="in_use">In Use</option>
            <option value="maintenance">Maintenance</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-lg bg-gray-200" />
      ) : data ? (
        <>
          <ScooterTable
            data={data}
            onEdit={setEditingScooter}
            onDelete={handleDelete}
          />
          <Pagination
            currentPage={data.meta.current_page}
            lastPage={data.meta.last_page}
            onPageChange={setPage}
          />
        </>
      ) : null}

      {(showForm || editingScooter) && (
        <ScooterForm
          scooter={editingScooter}
          onSubmit={editingScooter ? handleUpdate : handleCreate}
          onClose={() => {
            setShowForm(false);
            setEditingScooter(undefined);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
}
