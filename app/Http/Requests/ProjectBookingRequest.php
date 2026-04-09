<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectBookingRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'project_id' => 'required|exists:projects,id',
            'units' => 'required|integer|min:1',
            'user_id' => 'required',
            'payment_receipt' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'payment_method' => 'nullable|string',
            'payment_status' => 'nullable|string',
            'status' => 'nullable|string',
        ];
    }
}
