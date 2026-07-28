<?php

namespace App\DTO;

use App\Enums\ScooterStatus;

final readonly class ScooterData
{
    public function __construct(
        public string $number,
        public string $model,
        public ScooterStatus $status,
        public int $batteryLevel,
        public float $latitude,
        public float $longitude,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            number: $data['number'],
            model: $data['model'],
            status: ScooterStatus::from($data['status'] ?? 'available'),
            batteryLevel: $data['battery_level'],
            latitude: $data['latitude'],
            longitude: $data['longitude'],
        );
    }
}
