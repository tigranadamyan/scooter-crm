<?php

namespace App\Http\Resources;

use App\Models\Rental;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read int $user_id
 * @property-read int $scooter_id
 * @property-read string $start_time
 * @property-read string|null $end_time
 * @property-read string $status
 */
class RentalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var Rental $rental */
        $rental = $this->resource;

        return [
            'id' => $rental->id,
            'user_id' => $rental->user_id,
            'scooter_id' => $rental->scooter_id,
            'start_time' => $rental->start_time->toISOString(),
            'end_time' => $rental->end_time?->toISOString(),
            'status' => $rental->status->value,
            'status_label' => $rental->status->label(),
            'user' => $this->whenLoaded('user'),
            'scooter' => $this->whenLoaded('scooter'),
            'created_at' => $rental->created_at->toISOString(),
            'updated_at' => $rental->updated_at->toISOString(),
        ];
    }
}
