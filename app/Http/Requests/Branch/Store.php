<?php

namespace App\Http\Requests\Branch;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Validator;

class Store extends FormRequest
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
                'unique:product_types',
            ],
            'avatar' => [
                'required',
            ]
        ];
    }

    public function messages()
    {
        return [
            'name.required' 		=> __('validation.required'),
			'name.max' 				=> __('validation.max.string'),
			'name.unique' 			=> __('validation.unique'),

			'avatar.unique' 	    => __('validation.unique'),
        ];
    }

    public function attributes()
    {
        return [
            'name'      => 'Tên thương hiệu',
            'avatar'    => 'Ảnh đại diện',
        ];
    }
}
