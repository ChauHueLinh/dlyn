<?php

namespace App\Services;

use App\Helper\Response;
use App\Mail\UserActivationEmail;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use App\Models\Receipt;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class ReceiptService
{
    protected $receipt;
    protected $user;
    protected $coupon;
    protected $order;
    protected $product;

    public function __construct(
        Receipt $receipt,
        User $user,
        Coupon $coupon,
        Order $order,
        Product $product,
    )
    {
        $this->receipt = $receipt;
        $this->user = $user;
        $this->coupon = $coupon;
        $this->order = $order;
        $this->product = $product;
    }

    public function index($params)
    {
        $receipts = $this->receipt
            ->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC')
            // ->when(isset($params['status']), function ($query) use ($params) {
            //     return $query->status($params['status']);
            // })
            // ->when(isset($params['productTypeId']), function ($query) use ($params) {
            //     return $query->productType($params['productTypeId']);
            // })
            // ->when(isset($params['supplierId']), function ($query) use ($params) {
            //     return $query->supplier($params['supplierId']);
            // })
            // ->when(isset($params['branchId']), function ($query) use ($params) {
            //     return $query->branch($params['branchId']);
            // })
            ;

        $receipts = $receipts
            ->with([
                // 'attributes',
                // 'mainImage',
                // 'descriptionImages',
                // 'suppliers'
            ]);

        if (isset($params['per_page'])) {
            $receipts = $receipts
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $receipts = $receipts->get();
        }

        return $receipts;
    }

    public function store($params)
    {
        DB::beginTransaction();
        try {
            $total = 0;
            $products = [];
            if(count($params['products'] ?? []) > 0) {
                foreach($params['products'] as $item) {
                    $item = json_decode($item);
                    $product = $this->product->find($item->productId);

                    $total = $total + $product->price * $item->quantity;

                    $products[] = [
                        'productId' => $product->id,
                        'quantity' => $item->quantity,
                        'price' => $product->price,
                        'total' => $product->price * $item->quantity,
                    ];
                }
            }

            if(isset($params['userId'])) {
                $user = $this->user->find($params['userId']);
            } else {
                $password = substr(md5(mt_rand()), 0, 8);
                Mail::to($params['email']) ->send(new UserActivationEmail($params['email'], $password));
                $user = $this->user->create([
                    'name'      => $params['name'],
                    'status'    => User::ACTIVATE,
                    'phone'     => $params['phone'],
                    'email'     => $params['email'],
                    'address'   => $params['address'],
                    'password'  => Hash::make($password),
                ]);
            }
            
            $coupon = $this->coupon->find($params['couponId']);

            $paramsReceipt = [
                'code'          => 'DLYN' . Carbon::now()->timestamp,
                'status'        => Receipt::PAID,
                'userId'        => $user->id,
                'couponId'      => $coupon->id,
                'total'         => $total,
                'name'          => $params['name'],
                'phoneNumber'   => $params['phone'],
                'address'       => $params['address'],
                'createdBy'     => auth()->guard('admin')->user()->id,
                'updatedBy'     => auth()->guard('admin')->user()->id,
            ];

            $receipt = $this->receipt->create($paramsReceipt);

            $receipt->order()->create([
                'code'          => 'DLYN' . Carbon::now()->timestamp,
                'status'        => Order::NEW,
                'createdBy'     => auth()->guard('admin')->user()->id,
                'updatedBy'     => auth()->guard('admin')->user()->id,
            ]);

            foreach($products as $item) {
                $receipt->products()->attach($item['productId'], [
                    'quantity'  => $item['quantity'],
                    'price'     => $item['price'],
                    'total'     => $item['total'],
                ]);
            }

            DB::commit();
            
            return Response::responseArray(true, 'Tạo mới thành công.');
        } catch (\Exception $e) {
            DB::rollBack();

            return Response::responseArray(false, $e->getMessage());
        }
    }
}
