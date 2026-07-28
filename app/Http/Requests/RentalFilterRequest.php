<?php

namespace App\Http\Requests;

use App\Enums\RentalStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RentalFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => ['sometimes', 'string', 'max:100'],
            'status' => ['sometimes', Rule::enum(RentalStatus::class)],
            'user_id' => ['sometimes', 'integer', 'exists:users,id'],
            'scooter_id' => ['sometimes', 'integer', 'exists:scooters,id'],
            'sort' => ['sometimes', 'string', Rule::in(['start_time', 'end_time', 'status', 'created_at'])],
            'direction' => ['sometimes', 'string', Rule::in(['asc', 'desc'])],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
