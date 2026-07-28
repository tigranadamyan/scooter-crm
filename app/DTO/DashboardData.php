<?php

namespace App\DTO;

final readonly class DashboardData
{
    public function __construct(
        public int $availableCount,
        public int $inUseCount,
        public int $maintenanceCount,
        public int $offlineCount,
        public int $activeRentals,
        public float $averageBattery,
        public array $batteryDistribution,
    ) {}
}
