<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\RentalController;
use App\Http\Controllers\Api\ScooterController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Dashboard
    Route::get('/dashboard', DashboardController::class)
        ->name('dashboard')
        ->middleware('permission:dashboard.view');

    // Scooters
    Route::get('/scooters', [ScooterController::class, 'index'])
        ->middleware('permission:scooters.view')
        ->name('scooters.index');

    Route::post('/scooters', [ScooterController::class, 'store'])
        ->middleware('permission:scooters.create')
        ->name('scooters.store');

    Route::get('/scooters/{scooter}', [ScooterController::class, 'show'])
        ->middleware('permission:scooters.view')
        ->name('scooters.show');

    Route::put('/scooters/{scooter}', [ScooterController::class, 'update'])
        ->middleware('permission:scooters.update')
        ->name('scooters.update');

    Route::delete('/scooters/{scooter}', [ScooterController::class, 'destroy'])
        ->middleware('permission:scooters.delete')
        ->name('scooters.destroy');

    // Rentals
    Route::get('/rentals', [RentalController::class, 'index'])
        ->middleware('permission:rentals.view')
        ->name('rentals.index');

    Route::get('/rentals/{rental}', [RentalController::class, 'show'])
        ->middleware('permission:rentals.view')
        ->name('rentals.show');

    Route::post('/rentals', [RentalController::class, 'store'])
        ->middleware('permission:rentals.create')
        ->name('rentals.store');

    Route::patch('/rentals/{rental}/complete', [RentalController::class, 'complete'])
        ->middleware('permission:rentals.complete')
        ->name('rentals.complete');
});
