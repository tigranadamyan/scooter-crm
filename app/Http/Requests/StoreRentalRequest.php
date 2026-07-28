<?php

namespace App\Http\Requests;

use App\Models\Scooter;
use Illuminate\Foundation\Http\FormRequest;

class StoreRentalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'scooter_id' => ['required', 'exists:scooters,id'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($validator->errors()->any()) {
                return;
            }

            $scooter = Scooter::find($this->input('scooter_id'));

            if (! $scooter) {
                return;
            }

            if ($scooter->status->value === 'in_use') {
                $validator->errors()->add('scooter_id', 'This scooter is already in use.');
            }

            if ($scooter->status->value === 'maintenance') {
                $validator->errors()->add('scooter_id', 'This scooter is currently under maintenance.');
            }

            if ($scooter->status->value === 'offline') {
                $validator->errors()->add('scooter_id', 'This scooter is offline.');
            }

            if ($scooter->battery_level < 10) {
                $validator->errors()->add('scooter_id', 'Battery level is too low (minimum 10%).');
            }
        });
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'User ID is required.',
            'user_id.exists' => 'Selected user does not exist.',
            'scooter_id.required' => 'Scooter ID is required.',
            'scooter_id.exists' => 'Selected scooter does not exist.',
        ];
    }
}
