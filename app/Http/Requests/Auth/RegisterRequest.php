<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'phone' => ['required', 'string', 'regex:/^[0-9]{10,15}$/', 'unique:users,phone'],
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'phone.regex' => 'Please enter a valid phone number (10-15 digits).',
            'phone.unique' => 'This phone number is already registered.',
            'password.confirmed' => 'Password confirmation does not match.',
        ];
    }
}
