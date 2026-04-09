<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RoomRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'hotel_id' => 'required|exists:hotels,id',
            'price' => 'required|numeric|min:0',
            'max_occupancy' => 'required|integer|min:1',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'images.*.image' => 'Each file must be an image.',
            'images.*.mimes' => 'Only JPEG, PNG, JPG, and GIF images are allowed.',
            'images.*.max' => 'Each image must not exceed 2MB.',
        ];
    }
}
