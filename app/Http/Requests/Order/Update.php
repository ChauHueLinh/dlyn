<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class Update extends FormRequest
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
        return [
            'id'        => ['required'],
            'status'    => ['required'],
        ];
    }

    public function messages(): array
    {
        return [
            'id.required'       => __('validation.required'),
            'status.required'   => __('validation.required'),
        ];
    }

    public function attributes()
    {
        return [
            'id'        => 'Mã hóa đơn',
            'status'    => 'Trạng thái',
        ];
    }
}
