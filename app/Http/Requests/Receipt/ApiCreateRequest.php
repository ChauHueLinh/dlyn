<?php

namespace App\Http\Requests\Receipt;

use Illuminate\Foundation\Http\FormRequest;

class ApiCreateRequest extends FormRequest
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
        $products = [];
        foreach ($this->products as $product) {
            $data = json_decode($product);
            $products[] = [
                'id'                    => $data->id,
                'quantity'              => $data->quantity,
                'groupAttributeName'    => $data->groupAttributeName,
            ];
        }
        $this->request->remove('products');
        $this->request->add(['products' => $products]);

        return [
            'customerName'                      => ['required', 'max:191'],
            'customerEmail'                     => ['required', 'max:191', 'email', 'regex:/^([a-z0-9_-]+)(\.[a-z0-9_-]+)*@([a-z0-9_-]+\.)+[a-z]{2,6}$/ix'],
            'customerPhone'                     => ['required', 'numeric', 'digits:10'],
            'customerAddress'                   => ['required', 'max:191'],
            'couponId'                          => ['sometimes', 'numeric'],
            'note'                              => [],
            'serviceId'                         => ['required'],
            'serviceName'                       => ['required'],
            'serviceFee'                        => ['required', 'numeric'],
            'payment'                           => ['required'],
            'products.*.id'                     => ['required', 'numeric', 'exists:products'],
            'products.*.quantity'               => ['required', 'numeric', 'min:1'],
            'products.*.groupAttributeName'     => ['required'],
            'toDistrictId'                      => ['required'],
        ];
    }
}
