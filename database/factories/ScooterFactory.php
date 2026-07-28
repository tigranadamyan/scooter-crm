<?php

namespace Database\Factories;

use App\Enums\ScooterStatus;
use App\Models\Scooter;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Scooter>
 */
class ScooterFactory extends Factory
{
    protected $model = Scooter::class;

    public function definition(): array
    {
        return [
            'number' => fake()->unique()->numerify('SC-####'),
            'model' => fake()->randomElement(['Xiaomi Mi Pro 2', 'Ninebot Max', 'Segway E2', 'Kiwi Rider Pro', 'Urent Swift']),
            'status' => fake()->randomElement(ScooterStatus::cases()),
            'battery_level' => fake()->numberBetween(0, 100),
            'latitude' => fake()->latitude(55.7, 55.8),
            'longitude' => fake()->longitude(37.5, 37.7),
            'last_updated_at' => fake()->optional(0.8)->dateTimeBetween('-1 week', 'now'),
        ];
    }

    public function available(): static
    {
        return $this->state(fn () => [
            'status' => ScooterStatus::Available,
            'battery_level' => fake()->numberBetween(10, 100),
        ]);
    }

    public function inUse(): static
    {
        return $this->state(fn () => [
            'status' => ScooterStatus::InUse,
        ]);
    }

    public function maintenance(): static
    {
        return $this->state(fn () => [
            'status' => ScooterStatus::Maintenance,
        ]);
    }

    public function offline(): static
    {
        return $this->state(fn () => [
            'status' => ScooterStatus::Offline,
        ]);
    }

    public function lowBattery(): static
    {
        return $this->state(fn () => [
            'battery_level' => fake()->numberBetween(0, 9),
        ]);
    }
}
