<?php

namespace App\Http\Controllers\Api;

use App\DTO\ScooterData;
use App\Http\Controllers\Controller;
use App\Http\Requests\ScooterFilterRequest;
use App\Http\Requests\StoreScooterRequest;
use App\Http\Requests\UpdateScooterRequest;
use App\Http\Resources\PaginatedResource;
use App\Http\Resources\ScooterResource;
use App\Models\Scooter;
use App\Services\ScooterService;
use Illuminate\Http\JsonResponse;

class ScooterController extends Controller
{
    public function __construct(
        private readonly ScooterService $scooterService,
    ) {}

    public function index(ScooterFilterRequest $request): PaginatedResource
    {
        $scooters = $this->scooterService->getFiltered($request);

        return new PaginatedResource($scooters, ScooterResource::class);
    }

    public function show(Scooter $scooter): ScooterResource
    {
        return new ScooterResource($scooter);
    }

    public function store(StoreScooterRequest $request): JsonResponse
    {
        $data = ScooterData::fromArray($request->validated());
        $scooter = $this->scooterService->create($data);

        return (new ScooterResource($scooter))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateScooterRequest $request, Scooter $scooter): ScooterResource
    {
        $data = ScooterData::fromArray($request->validated());
        $scooter = $this->scooterService->update($scooter, $data);

        return new ScooterResource($scooter);
    }

    public function destroy(Scooter $scooter): JsonResponse
    {
        $this->scooterService->delete($scooter);

        return response()->json(null, 204);
    }
}
