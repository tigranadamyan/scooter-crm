<?php

namespace App\Http\Requests;

use App\Enums\ScooterStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreScooterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'number' => ['required', 'string', 'max:50', 'unique:scooters,number'],
            'model' => ['required', 'string', 'max:100'],
            'status' => ['sometimes', Rule::enum(ScooterStatus::class)],
            'battery_level' => ['required', 'integer', 'min:0', 'max:100'],
            'latitude' => ['required', 'numeric', 'min:-90', 'max:90'],
            'longitude' => ['required', 'numeric', 'min:-180', 'max:180'],
        ];
    }

    public function messages(): array
    {
        return [
            'number.required' => 'Scooter number is required.',
            'number.unique' => 'This scooter number already exists.',
            'model.required' => 'Scooter model is required.',
            'battery_level.min' => 'Battery level must be between 0 and 100.',
            'battery_level.max' => 'Battery level must be between 0 and 100.',
            'latitude.min' => 'Latitude must be between -90 and 90.',
            'latitude.max' => 'Latitude must be between -90 and 90.',
            'longitude.min' => 'Longitude must be between -180 and 180.',
            'longitude.max' => 'Longitude must be between -180 and 180.',
        ];
    }
}
