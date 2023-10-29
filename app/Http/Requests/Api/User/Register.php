<?php

namespace App\Http\Requests\Api\User;

use Illuminate\Foundation\Http\FormRequest;

class Register extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
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
                'unique:users',
            ],
            'email' => [
                'required',
                'max:255',
                'unique:users',
                'email',
                'regex:/^([a-z0-9_-]+)(\.[a-z0-9_-]+)*@([a-z0-9_-]+\.)+[a-z]{2,6}$/ix', 
            ],
            'password_confirmation' => [
                'required',
            ],
            'address' => [
                'required',
                'max:255',
            ],
        ];
        if($this->password_confirmation) {
            $rules['password'] = [
                'required',
                'min:8',
                'max:32',
                'confirmed',
            ];
        } else {
            $rules['password'] = [
                'required',
                'min:8',
                'max:32',
            ];
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'name.required'                     => __('validation.required'),
            'name.max'                          => __('validation.max.string'),

            'phone.required'                    => __('validation.required'),
            'phone.numeric'                     => __('validation.numeric'),
            'phone.digits'                      => __('validation.digits'),
            'phone.unique'                      => __('validation.unique'),

            'email.required'                    => __('validation.required'),
            'email.email'                       => __('validation.email'),
            'email.max'                         => __('validation.max.string'),
            'email.regex'                       => __('validation.email'),
            'email.unique'                      => __('validation.unique'),

            'password.required'                 => __('validation.required'),
            'password.max'                      => __('validation.max.string'),
            'password.min'                      => __('validation.min.string'),
            'password.confirmed'                => __('validation.confirmed'),

            'password_confirmation.required'    => __('validation.required'),

            'address.required'                  => __('validation.required'),
            'address.max'                       => __('validation.max.string'),
        ];
    }

    public function attributes()
    {
        return [
            'name'                  => 'Tên',
            'phone'                 => 'Số điện thoại',
            'email'                 => 'Email',
            'password'              => 'Mật khẩu',
            'password_confirmation' => 'Xác nhận mật khẩu',
            'address'               => 'Địa chỉ',
            'address'               => 'Địa chỉ',
        ];
    }
}

