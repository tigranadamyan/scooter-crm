<?php

namespace App\Policies;

use App\Models\Scooter;
use App\Models\User;

class ScooterPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('scooters.view');
    }

    public function view(User $user, Scooter $scooter): bool
    {
        return $user->can('scooters.view');
    }

    public function create(User $user): bool
    {
        return $user->can('scooters.create');
    }

    public function update(User $user, Scooter $scooter): bool
    {
        return $user->can('scooters.update');
    }

    public function delete(User $user, Scooter $scooter): bool
    {
        return $user->can('scooters.delete');
    }
}
