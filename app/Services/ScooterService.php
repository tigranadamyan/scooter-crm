<?php

namespace App\Services;

use App\DTO\DashboardData;
use App\DTO\ScooterData;
use App\Enums\ScooterStatus;
use App\Http\Requests\ScooterFilterRequest;
use App\Models\Rental;
use App\Models\Scooter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ScooterService
{
    public function getFiltered(ScooterFilterRequest $request): LengthAwarePaginator
    {
        $query = Scooter::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('number', 'ilike', "%{$search}%")
                    ->orWhere('model', 'ilike', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($request->has('battery_min')) {
            $query->where('battery_level', '>=', $request->input('battery_min'));
        }

        if ($request->has('battery_max')) {
            $query->where('battery_level', '<=', $request->input('battery_max'));
        }

        $sortField = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');

        $query->orderBy($sortField, $direction);

        return $query->paginate($request->input('per_page', 15));
    }

    public function getById(int $id): Scooter
    {
        return Scooter::findOrFail($id);
    }

    public function create(ScooterData $data): Scooter
    {
        return Scooter::create([
            'number' => $data->number,
            'model' => $data->model,
            'status' => $data->status,
            'battery_level' => $data->batteryLevel,
            'latitude' => $data->latitude,
            'longitude' => $data->longitude,
            'last_updated_at' => now(),
        ]);
    }

    public function update(Scooter $scooter, ScooterData $data): Scooter
    {
        $scooter->update([
            'number' => $data->number,
            'model' => $data->model,
            'status' => $data->status,
            'battery_level' => $data->batteryLevel,
            'latitude' => $data->latitude,
            'longitude' => $data->longitude,
            'last_updated_at' => now(),
        ]);

        return $scooter->fresh();
    }

    public function delete(Scooter $scooter): bool
    {
        return $scooter->delete();
    }

    public function getDashboard(): DashboardData
    {
        $availableCount = Scooter::where('status', ScooterStatus::Available)->count();
        $inUseCount = Scooter::where('status', ScooterStatus::InUse)->count();
        $maintenanceCount = Scooter::where('status', ScooterStatus::Maintenance)->count();
        $offlineCount = Scooter::where('status', ScooterStatus::Offline)->count();
        $activeRentals = Rental::where('status', \App\Enums\RentalStatus::Active)->count();
        $averageBattery = Scooter::avg('battery_level') ?? 0;

        $batteryDistribution = [
            ['name' => '0-25%', 'count' => Scooter::whereBetween('battery_level', [0, 25])->count()],
            ['name' => '25-50%', 'count' => Scooter::whereBetween('battery_level', [26, 50])->count()],
            ['name' => '50-75%', 'count' => Scooter::whereBetween('battery_level', [51, 75])->count()],
            ['name' => '75-100%', 'count' => Scooter::whereBetween('battery_level', [76, 100])->count()],
        ];

        return new DashboardData(
            availableCount: $availableCount,
            inUseCount: $inUseCount,
            maintenanceCount: $maintenanceCount,
            offlineCount: $offlineCount,
            activeRentals: $activeRentals,
            averageBattery: (float) $averageBattery,
            batteryDistribution: $batteryDistribution,
        );
    }

    public function getAvailable()
    {
        return Scooter::where('status', ScooterStatus::Available)
            ->where('battery_level', '>=', 10)
            ->get();
    }
}
