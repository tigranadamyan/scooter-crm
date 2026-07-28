<?php

namespace App\Http\Requests;

use App\Enums\ScooterStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateScooterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $scooterId = $this->route('scooter')?->id ?? $this->route('scooter');

        return [
            'number' => ['sometimes', 'string', 'max:50', Rule::unique('scooters', 'number')->ignore($scooterId)],
            'model' => ['sometimes', 'string', 'max:100'],
            'status' => ['sometimes', Rule::enum(ScooterStatus::class)],
            'battery_level' => ['sometimes', 'integer', 'min:0', 'max:100'],
            'latitude' => ['sometimes', 'numeric', 'min:-90', 'max:90'],
            'longitude' => ['sometimes', 'numeric', 'min:-180', 'max:180'],
        ];
    }

    public function messages(): array
    {
        return [
            'number.unique' => 'This scooter number already exists.',
            'battery_level.min' => 'Battery level must be between 0 and 100.',
            'battery_level.max' => 'Battery level must be between 0 and 100.',
        ];
    }
}
