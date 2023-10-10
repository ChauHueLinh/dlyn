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
				Rule::unique('products')->ignore($this->id),
                'max:255',
            ],
            'price' => [
                'required',
                'numeric',
                'min:0',
            ],
        ];
    }

    public function messages()
    {
        return [
            'name.required' 		=> __('validation.required'),
			'name.unique' 			=> __('validation.unique'),
			'name.max' 				=> __('validation.max.string'),

            'price.required' 	    => __('validation.required'),
            'price.numeric' 	    => __('validation.numeric'),
            'price.min' 	        => __('validation.numeric'),
        ];
    }

    public function attributes()
    {
        return [
            'name'  => 'Tên sản phẩm',
            'price' => 'Giá',
        ];
    }
}
