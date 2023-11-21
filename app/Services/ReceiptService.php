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
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use PhpParser\Node\Stmt\TryCatch;

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
    ) {
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
                'user',
                'coupon',
                'products',
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
            if (count($params['products'] ?? []) > 0) {
                foreach ($params['products'] as $item) {
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

            if (isset($params['userId'])) {
                $user = $this->user->find($params['userId']);
            } else {
                $password = substr(md5(mt_rand()), 0, 8);
                Mail::to($params['email'])->send(new UserActivationEmail($params['email'], $password));
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

            if ($coupon->unit == Coupon::VND) {
                $discount = $coupon->value;
            } elseif ($coupon->unit == Coupon::PERCENT) {
                $discount = $total * $coupon->value / 100;
            }

            $paramsReceipt = [
                'code'          => 'DLYN' . Carbon::now()->timestamp,
                'status'        => $params['status'],
                'userId'        => $user->id,
                'couponId'      => $coupon->id,
                'total'         => $total - $discount,
                'name'          => $params['name'],
                'note'          => $params['note'],
                'phoneNumber'   => $params['phone'],
                'address'       => $params['address'],
                'createdBy'     => 'admin_' . auth()->guard('admin')->user()->id,
                'updatedBy'     => 'admin_' . auth()->guard('admin')->user()->id,
            ];

            $receipt = $this->receipt->create($paramsReceipt);

            $order = $receipt->order()->create([
                'code'          => $receipt->code,
                'status'        => Order::NEW,
                'createdBy'     => 'admin_' . auth()->guard('admin')->user()->id,
                'updatedBy'     => 'admin_' . auth()->guard('admin')->user()->id,
            ]);

            $orderHistory = $order->histories()->create([
                'orderId' => $order->id,
                'status' => Order::NEW,
                'createdBy' => 'admin_' . auth()->guard('admin')->user()->id,
            ]);

            foreach ($products as $item) {
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

    public function update($params)
    {
        $receipt = $this->receipt->find($params['id']);
        if (!$receipt) {
            return Response::responseArray(false, 'Đã có lỗi xảy ra.');
        }

        $receipt->update($params);

        return Response::responseArray(true, 'Cập nhật thành công.');
    }

    public function destroy($params)
    {
        $receipt = $this->receipt->find($params['id']);
        if (!$receipt) {
            return Response::responseArray(false, 'Đã có lỗi xảy ra.');
        }

        $receipt->delete();

        return Response::responseArray(true, 'Cập nhật thành công.');
    }

    public function apiCreateReceipt($params)
    {
        try {
            DB::beginTransaction();
            $totalBill = 0;
            $products = [];
            $urlCreateOrderGHN = env('URL_CREATE_ORDER_GHN');
            $headers = [
                'Content-type'  => 'application/json',
                'ShopId'        => env('SHOP_ID'),
                'Token'         => env('SHOP_TOKEN'),
            ];
            foreach ($params['products'] as $eachProduct) {
                $product = $this->product->where('id', $eachProduct['id'])->first();
                $productAttributes = $product->attributes()->where('groupName', $eachProduct['groupAttributeName'])->get();
                foreach($productAttributes as $eachAttribute) {
                    $eachAttribute->update(['quantity' => $eachAttribute->quantity - $eachProduct['quantity']]);
                }
                $totalBill = $totalBill + $product->price * $eachProduct['quantity'];
                $products[] = [
                    'productId' => $product->id,
                    'quantity' => $eachProduct['quantity'],
                    'price' => $product->price,
                    'total' => $product->price * $eachProduct['quantity'],
                    'category' => $eachProduct['groupAttributeName'],
                ];
            }
            $user = $this->user->where('id', $params['userId'])->first();
            if (isset($params['couponId'])) {
                $coupon = $this->coupon->where('id', $params['couponId'])->first();
                if ($coupon->unit == Coupon::VND) {
                    $discount = $coupon->value;
                } elseif ($coupon->unit == Coupon::PERCENT) {
                    $discount = $totalBill * $coupon->value / 100;
                }
                $totalBill = $totalBill - $discount;
            }
            $totalBill = $totalBill + $params['serviceFee'];

            $receipt = $user->receipts()->create([
                'code'          => 'DLYN' . Carbon::now()->timestamp,
                'status'        => $params['payment'] == 'COD' ? Receipt::UNPAID : Receipt::PAID,
                'userId'        => $user->id,
                'couponId'      => $params['couponId'] ?? '',
                'total'         => $totalBill,
                'name'          => $params['customerName'],
                'phoneNumber'   => $params['customerPhone'],
                'address'       => $params['customerAddress'],
                'note'          => $params['note'] ?? '',
                'createdBy'     => 'user_' . $user->id,
            ]);
            foreach ($products as $product) {
                $receipt->products()->attach($product['productId'], [
                    'quantity'  => $product['quantity'],
                    'price'     => $product['price'],
                    'total'     => $product['total'],
                ]);
            }
            $order = $receipt->order()->create([
                'code'          => $receipt->code,
                'status'        => Order::NEW,
                'createdBy'     => 'user_' . $user->id,
                'updatedBy'     => 'user_' . $user->id,
            ]);
            $order->histories()->create([
                'orderId' => $order->id,
                'status' => Order::NEW,
                'createdBy' => 'user_' . $user->id,
            ]);
            DB::commit();
            return Response::responseArray(true, 'Đặt hàng thành công. Đơn hàng đang được xác nhận.');
        } catch (\Throwable $th) {
            DB::rollBack();
            return Response::responseArray(false, $th->getMessage());
        }
    }
}
