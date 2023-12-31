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
            'quantity' => [
                'required',
                'numeric',
                'min:0',
            ],
            'productTypeId' => [
                'required',
                'numeric',
                'min:0',
            ],
            'branchId' => [
                'required',
                'numeric',
                'min:0',
            ],
        ];
    }

    public function messages()
    {
        return [
            'name.required' 		    => __('validation.required'),
			'name.unique' 			    => __('validation.unique'),
			'name.max' 				    => __('validation.max.string'),

            'price.required' 	        => __('validation.required'),
            'price.numeric' 	        => __('validation.numeric'),
            'price.min' 	            => __('validation.numeric'),
            
            'quantity.required' 	    => __('validation.required'),
            'quantity.numeric' 	        => __('validation.numeric'),
            'quantity.min' 	            => __('validation.numeric'),

            'productTypeId.required'    => __('validation.required'),
            'productTypeId.numeric' 	=> __('validation.numeric'),
            'productTypeId.min' 	    => __('validation.numeric'),

            'branchId.required' 	    => __('validation.required'),
            'branchId.numeric' 	        => __('validation.numeric'),
            'branchId.min' 	            => __('validation.numeric'),
        ];
    }

    public function attributes()
    {
        return [
            'name'          => 'Tên sản phẩm',
            'price'         => 'Giá',
            'quantity'      => 'Số lượng',
            'productTypeId' => 'Loại Sản phẩm',
            'branchId'      => 'Thương hiệu',
        ];
    }
}
