<?php

namespace App\Http\Requests\Receipt;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class Update extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'id' => [
                'required'
            ],
            'status' => [
                'required',
            ],
        ];
    } 

    public function messages()
    {
        return [
            'id.required'     => __('validation.required'),
            'status.required' => __('validation.required'),
        ];
    }

    public function attributes()
    {
        return [
            'id' => 'ID',
            'status' => 'Trạng thái',
        ];
    }
}
