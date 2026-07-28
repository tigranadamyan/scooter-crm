<?php

namespace Database\Factories;

use App\Enums\RentalStatus;
use App\Models\Rental;
use App\Models\Scooter;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Rental>
 */
class RentalFactory extends Factory
{
    protected $model = Rental::class;

    public function definition(): array
    {
        $startTime = fake()->dateTimeBetween('-1 month', 'now');
        $endTime = fake()->optional(0.7)->dateTimeBetween($startTime, 'now');

        return [
            'user_id' => User::factory(),
            'scooter_id' => Scooter::factory(),
            'start_time' => $startTime,
            'end_time' => $endTime,
            'status' => $endTime ? RentalStatus::Completed : RentalStatus::Active,
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => [
            'end_time' => null,
            'status' => RentalStatus::Active,
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'end_time' => $attributes['start_time'] ?? fake()->dateTimeBetween('-1 month', 'now'),
            'status' => RentalStatus::Completed,
        ]);
    }
}
