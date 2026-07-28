import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  scooterApi,
  rentalApi,
  dashboardApi,
  type ScooterFilters,
  type RentalFilters,
  type CreateScooterData,
  type UpdateScooterData,
  type CreateRentalData,
} from "@/services/api";

export function useScooters(filters?: ScooterFilters) {
  return useQuery({
    queryKey: ["scooters", filters],
    queryFn: () => scooterApi.list(filters),
    select: (data) => data.data,
    refetchInterval: 10000,
  });
}

export function useScooter(id: number) {
  return useQuery({
    queryKey: ["scooter", id],
    queryFn: () => scooterApi.get(id),
    select: (data) => data.data,
  });
}

export function useCreateScooter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateScooterData) => scooterApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scooters"] });
    },
  });
}

export function useUpdateScooter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateScooterData }) =>
      scooterApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scooters"] });
    },
  });
}

export function useDeleteScooter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => scooterApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scooters"] });
    },
  });
}

export function useRentals(filters?: RentalFilters) {
  return useQuery({
    queryKey: ["rentals", filters],
    queryFn: () => rentalApi.list(filters),
    select: (data) => data.data,
    refetchInterval: 10000,
  });
}

export function useRental(id: number) {
  return useQuery({
    queryKey: ["rental", id],
    queryFn: () => rentalApi.get(id),
    select: (data) => data.data,
  });
}

export function useCreateRental() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRentalData) => rentalApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      queryClient.invalidateQueries({ queryKey: ["scooters"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useCompleteRental() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => rentalApi.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      queryClient.invalidateQueries({ queryKey: ["scooters"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboardApi.get(),
    select: (response) => (response.data as Record<string, unknown>).data,
    refetchInterval: 10000,
  });
}
