<?php

namespace App\Http\Requests;

use App\Enums\ScooterStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ScooterFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => ['sometimes', 'string', 'max:100'],
            'status' => ['sometimes', Rule::enum(ScooterStatus::class)],
            'battery_min' => ['sometimes', 'integer', 'min:0', 'max:100'],
            'battery_max' => ['sometimes', 'integer', 'min:0', 'max:100'],
            'sort' => ['sometimes', 'string', Rule::in(['number', 'model', 'status', 'battery_level', 'created_at', 'updated_at'])],
            'direction' => ['sometimes', 'string', Rule::in(['asc', 'desc'])],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
