<?php

namespace App\Http\Requests\Receipt;

use Illuminate\Foundation\Http\FormRequest;

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
        $rules = [
            'name' => [
                'required',
                'max:255',
            ],
            'phone' => [
                'required',
                'numeric',
                'digits:10',
            ],
            'email' => [
                'required', 
                'email', 
                'max:255',
                'regex:/^([a-z0-9_-]+)(\.[a-z0-9_-]+)*@([a-z0-9_-]+\.)+[a-z]{2,6}$/ix', 
            ],
            'address' => [
                'required',
                'max:255',
            ],
        ];

        return $rules;
    } 

    public function messages()
    {
        return [
            'name.required'     => __('validation.required'),
            'name.max'          => __('validation.max.string'),

            'phone.required'    => __('validation.required'),
            'phone.numeric'     => __('validation.numeric'),
            'phone.digits'      => __('validation.digits'),

            'email.required'    => __('validation.required'),
            'email.email'       => __('validation.email'),
            'email.max'         => __('validation.max.string'),
            'email.regex'       => __('validation.email'),

            'address.required'  => __('validation.required'),
            'address.max'       => __('validation.max.string'),
        ];
    }

    public function attributes()
    {
        return [
            'name' => 'Tên',
            'phone' => 'Số điện thoại',
            'email' => 'Email',
            'address' => 'Địa chỉ',
        ];
    }
}
