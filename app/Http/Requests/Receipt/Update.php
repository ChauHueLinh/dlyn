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
                Rule::unique('admins')->ignore($this->id),
                'max:255',
                'regex:/^([a-z0-9_-]+)(\.[a-z0-9_-]+)*@([a-z0-9_-]+\.)+[a-z]{2,6}$/ix', 
            ],
            'roleId' => [],
            'status' => [
                'required'
            ],
        ];

        if(isset($this->avatar)) {
            $rules['avatar'] = [
                'file',
                'max:2048',
                'mimes:jpg,jpeg,png',
            ];
        }

        if(isset($this->password)) {
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
            'name.required'     => __('validation.required'),
            'name.max'          => __('validation.max.string'),

            'phone.required'    => __('validation.required'),
            'phone.numeric'     => __('validation.numeric'),
            'phone.digits'      => __('validation.digits'),

            'email.required'    => __('validation.required'),
            'email.email'       => __('validation.email'),
            'email.max'         => __('validation.max.string'),
            'email.unique'      => __('validation.unique'),
            'email.regex'       => __('validation.email'),

            'password.required' => __('validation.required'),
            'password.max'      => __('validation.max.string'),
            'password.min'      => __('validation.min.string'),

            'status.required'   => __('validation.required'),

            'avatar.file'       => __('validaton.file'),
            'avatar.size'       => __('validaton.size'),
            'avatar.mimes'      => __('validaton.mimes'),
        ];
    }

    public function attributes()
    {
        return [
            'name' => 'Tên',
            'phone' => 'Số điện thoại',
            'email' => 'Email',
            'password' => 'Mật khẩu',
            'roleId' => 'Vai trò',
            'status' => 'Trạng thái',
            'avatar' => 'Ảnh đại diện',
        ];
    }
}
