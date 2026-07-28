<?php

namespace App\DTO;

use App\Enums\RentalStatus;
use Carbon\Carbon;

final readonly class RentalData
{
    public function __construct(
        public int $userId,
        public int $scooterId,
        public Carbon $startTime,
        public ?Carbon $endTime,
        public RentalStatus $status,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            userId: $data['user_id'],
            scooterId: $data['scooter_id'],
            startTime: $data['start_time'] instanceof Carbon ? $data['start_time'] : Carbon::parse($data['start_time']),
            endTime: isset($data['end_time']) && $data['end_time'] instanceof Carbon ? $data['end_time'] : (isset($data['end_time']) ? Carbon::parse($data['end_time']) : null),
            status: RentalStatus::from($data['status'] ?? 'active'),
        );
    }
}
