<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

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
            'name' => [
                'required',
                'max:255',
                Rule::unique('roles')->ignore($this->id),
            ],
            'description' => [
                'required',
            ],
        ];
    }

    public function messages()
    {
        return [
            'name.required' 		=> __('validation.required'),
			'name.max' 				=>__('validation.max.string'),
			'name.unique' 			=>__('validation.unique'),

            'description.required' 	=> __('validation.required')
        ];
    }

    public function attributes()
    {
        return [
            'name' => 'Tên vai trò',
            'description' => 'Mô tả',
        ];
    }
}
