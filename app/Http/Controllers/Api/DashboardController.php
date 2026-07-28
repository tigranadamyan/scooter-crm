<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DashboardResource;
use App\Services\ScooterService;

class DashboardController extends Controller
{
    public function __construct(
        private readonly ScooterService $scooterService,
    ) {}

    public function __invoke(): DashboardResource
    {
        $data = $this->scooterService->getDashboard();

        return new DashboardResource($data);
    }
}
