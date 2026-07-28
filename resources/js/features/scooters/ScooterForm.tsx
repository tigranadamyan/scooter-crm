import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Scooter } from "@/types";
import { X } from "lucide-react";

const scooterSchema = z.object({
  number: z.string().min(1, "Number is required").max(50),
  model: z.string().min(1, "Model is required").max(100),
  status: z.enum(["available", "in_use", "maintenance", "offline"]).optional(),
  battery_level: z.number().min(0).max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

type ScooterFormData = z.infer<typeof scooterSchema>;

interface ScooterFormProps {
  scooter?: Scooter;
  onSubmit: (data: ScooterFormData) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function ScooterForm({ scooter, onSubmit, onClose, isLoading }: ScooterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ScooterFormData>({
    resolver: zodResolver(scooterSchema),
    defaultValues: scooter
      ? {
          number: scooter.number,
          model: scooter.model,
          status: scooter.status,
          battery_level: scooter.battery_level,
          latitude: scooter.latitude,
          longitude: scooter.longitude,
        }
      : {
          status: "available",
          battery_level: 100,
          latitude: 55.7558,
          longitude: 37.6173,
        },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {scooter ? "Edit Scooter" : "Create Scooter"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Number</label>
            <input
              {...register("number")}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.number && (
              <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Model</label>
            <input
              {...register("model")}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.model && (
              <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              {...register("status")}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="available">Available</option>
              <option value="in_use">In Use</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Battery Level</label>
            <input
              type="number"
              {...register("battery_level", { valueAsNumber: true })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.battery_level && (
              <p className="mt-1 text-sm text-red-600">{errors.battery_level.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Latitude</label>
              <input
                type="number"
                step="any"
                {...register("latitude", { valueAsNumber: true })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.latitude && (
                <p className="mt-1 text-sm text-red-600">{errors.latitude.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Longitude</label>
              <input
                type="number"
                step="any"
                {...register("longitude", { valueAsNumber: true })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.longitude && (
                <p className="mt-1 text-sm text-red-600">{errors.longitude.message}</p>
              )}
            </div>
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
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : scooter ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
