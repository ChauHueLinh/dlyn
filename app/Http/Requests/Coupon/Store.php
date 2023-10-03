<?php

namespace App\Http\Requests\Coupon;

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
            'code' => [
                'required',
				'unique:coupons',
                'max:50',
                'regex:/^[A-Z0-9][\[A-Z\-0-9\]]*$/u',
            ],
            'value' => [
                'required',
                'numeric',
                'min:0',
            ],
            'unit' => [
                'required',
            ],
        ];
    }

    public function messages()
    {
        return [
            'code.required' 		=> __('validation.required'),
			'code.max' 				=> __('validation.max.string'),
			'code.unique' 			=> __('validation.unique'),
			'code.regex' 			=> __('validation.uppercase_and_number'),

            'value.required' 	    => __('validation.required'),
            'value.numeric' 	    => __('validation.numeric'),
            'value.min' 	    => __('validation.numeric'),

            'unit.required' 	    => __('validation.required'),
        ];
    }

    public function attributes()
    {
        return [
            'code'  => 'Mã giảm giá',
            'value' => 'Giá trị',
            'unit'  => 'Đơn vị',
        ];
    }
}
