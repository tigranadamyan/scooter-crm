<?php

namespace App\Models;

use App\Enums\ScooterStatus;
use Database\Factories\ScooterFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $number
 * @property string $model
 * @property ScooterStatus $status
 * @property int $battery_level
 * @property float $latitude
 * @property float $longitude
 * @property \Illuminate\Support\Carbon|null $last_updated_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Scooter extends Model
{
    /** @use HasFactory<ScooterFactory> */
    use HasFactory;

    protected $fillable = [
        'number',
        'model',
        'status',
        'battery_level',
        'latitude',
        'longitude',
        'last_updated_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => ScooterStatus::class,
            'battery_level' => 'integer',
            'latitude' => 'float',
            'longitude' => 'float',
            'last_updated_at' => 'datetime',
        ];
    }

    public function rentals(): HasMany
    {
        return $this->hasMany(Rental::class);
    }

    public function isAvailable(): bool
    {
        return $this->status === ScooterStatus::Available
            && $this->battery_level >= 10;
    }
}
