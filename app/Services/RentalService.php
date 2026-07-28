<?php

namespace App\Services;

use App\DTO\RentalData;
use App\Enums\RentalStatus;
use App\Enums\ScooterStatus;
use App\Exceptions\CannotCompleteRentalException;
use App\Http\Requests\RentalFilterRequest;
use App\Models\Rental;
use App\Models\Scooter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class RentalService
{
    public function getFiltered(RentalFilterRequest $request): LengthAwarePaginator
    {
        $query = Rental::with(['user', 'scooter']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('scooter', function ($sq) use ($search) {
                    $sq->where('number', 'ilike', "%{$search}%")
                        ->orWhere('model', 'ilike', "%{$search}%");
                })
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'ilike', "%{$search}%")
                            ->orWhere('phone', 'ilike', "%{$search}%");
                    });
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($userId = $request->input('user_id')) {
            $query->where('user_id', $userId);
        }

        if ($scooterId = $request->input('scooter_id')) {
            $query->where('scooter_id', $scooterId);
        }

        $sortField = $request->input('sort', 'start_time');
        $direction = $request->input('direction', 'desc');

        $query->orderBy($sortField, $direction);

        return $query->paginate($request->input('per_page', 15));
    }

    public function getById(int $id): Rental
    {
        return Rental::with(['user', 'scooter'])->findOrFail($id);
    }

    public function create(RentalData $data): Rental
    {
        return DB::transaction(function () use ($data) {
            $scooter = Scooter::lockForUpdate()->findOrFail($data->scooterId);

            $rental = Rental::create([
                'user_id' => $data->userId,
                'scooter_id' => $data->scooterId,
                'start_time' => $data->startTime,
                'status' => RentalStatus::Active,
            ]);

            $scooter->update([
                'status' => ScooterStatus::InUse,
                'last_updated_at' => now(),
            ]);

            return $rental->load(['user', 'scooter']);
        });
    }

    public function complete(Rental $rental): Rental
    {
        return DB::transaction(function () use ($rental) {
            if ($rental->status !== RentalStatus::Active) {
                throw new CannotCompleteRentalException('Only active rentals can be completed.');
            }

            $rental->update([
                'end_time' => now(),
                'status' => RentalStatus::Completed,
            ]);

            $scooter = Scooter::lockForUpdate()->findOrFail($rental->scooter_id);
            $newStatus = $scooter->battery_level >= 10
                ? ScooterStatus::Available
                : ScooterStatus::Maintenance;

            $scooter->update([
                'status' => $newStatus,
                'last_updated_at' => now(),
            ]);

            return $rental->fresh(['user', 'scooter']);
        });
    }

    public function getActiveCount(): int
    {
        return Rental::where('status', RentalStatus::Active)->count();
    }
}
