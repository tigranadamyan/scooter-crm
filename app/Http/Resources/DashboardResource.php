<?php

namespace App\Http\Resources;

use App\DTO\DashboardData;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    public function __construct(DashboardData $data)
    {
        parent::__construct($data);
    }

    public function toArray(Request $request): array
    {
        /** @var DashboardData $data */
        $data = $this->resource;

        return [
            'scooters' => [
                'available' => $data->availableCount,
                'in_use' => $data->inUseCount,
                'maintenance' => $data->maintenanceCount,
                'offline' => $data->offlineCount,
            ],
            'active_rentals' => $data->activeRentals,
            'average_battery' => round($data->averageBattery, 1),
            'battery_distribution' => $data->batteryDistribution,
        ];
    }
}
