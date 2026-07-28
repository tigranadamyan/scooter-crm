<?php

namespace App\Policies;

use App\Models\Rental;
use App\Models\User;

class RentalPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('rentals.view');
    }

    public function view(User $user, Rental $rental): bool
    {
        return $user->can('rentals.view');
    }

    public function create(User $user): bool
    {
        return $user->can('rentals.create');
    }

    public function complete(User $user, Rental $rental): bool
    {
        return $user->can('rentals.complete');
    }
}
