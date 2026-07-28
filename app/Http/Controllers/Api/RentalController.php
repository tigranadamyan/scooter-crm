<?php

namespace App\Http\Controllers\Api;

use App\DTO\RentalData;
use App\Http\Controllers\Controller;
use App\Http\Requests\RentalFilterRequest;
use App\Http\Requests\StoreRentalRequest;
use App\Http\Resources\PaginatedResource;
use App\Http\Resources\RentalResource;
use App\Models\Rental;
use App\Services\RentalService;
use Illuminate\Http\JsonResponse;

class RentalController extends Controller
{
    public function __construct(
        private readonly RentalService $rentalService,
    ) {}

    public function index(RentalFilterRequest $request): PaginatedResource
    {
        $rentals = $this->rentalService->getFiltered($request);

        return new PaginatedResource($rentals, RentalResource::class);
    }

    public function show(Rental $rental): RentalResource
    {
        $rental->load(['user', 'scooter']);

        return new RentalResource($rental);
    }

    public function store(StoreRentalRequest $request): JsonResponse
    {
        $data = RentalData::fromArray(array_merge($request->validated(), [
            'start_time' => now(),
            'status' => 'active',
        ]));
        $rental = $this->rentalService->create($data);

        return (new RentalResource($rental))
            ->response()
            ->setStatusCode(201);
    }

    public function complete(Rental $rental): RentalResource
    {
        $rental = $this->rentalService->complete($rental);

        return new RentalResource($rental);
    }
}
