<?php

namespace App\Http\Resources;

use App\Models\Scooter;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read string $number
 * @property-read string $model
 * @property-read string $status
 * @property-read int $battery_level
 * @property-read float $latitude
 * @property-read float $longitude
 * @property-read string|null $last_updated_at
 * @property-read string $created_at
 * @property-read string $updated_at
 */
class ScooterResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var Scooter $scooter */
        $scooter = $this->resource;

        return [
            'id' => $scooter->id,
            'number' => $scooter->number,
            'model' => $scooter->model,
            'status' => $scooter->status->value,
            'status_label' => $scooter->status->label(),
            'battery_level' => $scooter->battery_level,
            'latitude' => $scooter->latitude,
            'longitude' => $scooter->longitude,
            'last_updated_at' => $scooter->last_updated_at?->toISOString(),
            'created_at' => $scooter->created_at->toISOString(),
            'updated_at' => $scooter->updated_at->toISOString(),
        ];
    }
}
