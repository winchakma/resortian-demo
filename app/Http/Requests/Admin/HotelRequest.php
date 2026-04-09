<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class HotelRequest extends FormRequest
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
            'short_description' => 'nullable|string|max:255',
            'long_description' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'location' => 'required|string|max:255',
            'rating' => 'nullable|numeric|min:0|max:5',
            'reviews_count' => 'nullable|integer|min:0',
            'price' => 'nullable|integer|min:0',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string',
            'district_id' => 'required|exists:districts,id',
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
