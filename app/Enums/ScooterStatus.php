<?php

namespace App\Enums;

enum ScooterStatus: string
{
    case Available = 'available';
    case InUse = 'in_use';
    case Maintenance = 'maintenance';
    case Offline = 'offline';

    public function label(): string
    {
        return match ($this) {
            self::Available => 'Available',
            self::InUse => 'In Use',
            self::Maintenance => 'Maintenance',
            self::Offline => 'Offline',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Available => 'green',
            self::InUse => 'blue',
            self::Maintenance => 'orange',
            self::Offline => 'red',
        };
    }
}
