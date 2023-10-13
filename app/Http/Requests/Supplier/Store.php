<?php

namespace App\Http\Requests\Supplier;

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

    public function validationData()
    {
        return $this->post();
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
                'unique:suppliers',
            ],
            'provinceId' => [
                'required',
                'numeric'
            ],
            'districtId' => [
                'required',
                'numeric'
            ],
            'wardId' => [
                'required',
                'numeric'
            ],
            'address' => [
                'required',
                'max:255',
            ],
        ];
    }

    public function messages()
    {
        return [
            'name.required' 		    => __('validation.required'),
			'name.max' 				    => __('validation.max.string'),
            'name.unique' 			    => __('validation.unique'),

            'provinceId.required' 		=> __('validation.required'),
			'provinceId.nummeric' 	    => __('validation.nummeric'),

            'districtId.required' 		=> __('validation.required'),
			'districtId.numeric' 	    => __('validation.numeric'),

            'wardId.required' 		    => __('validation.required'),
			'wardId.nummeric' 	        => __('validation.nummeric'),

            'address.required' 		    => __('validation.required'),
			'address.max' 				=> __('validation.max.string'),
        ];
    }

    public function attributes()
    {
        return [
            'name'          => 'Tên nhà cung cấp',
            'provinceId'    => 'Tỉnh\thành phố trung ương',
            'districtId'    => 'Thành phố\quận\huyện\thị xã',
            'wardId'        => 'Phường\xã\thị trấn',
            'address'       => 'Địa chỉ',
        ];
    }
}
