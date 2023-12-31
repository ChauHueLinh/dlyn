<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    const ACTIVATE = 1;
    const DEACTIVATE = 0;

    protected $fillable = [
        'name',
        'status',
        'email',
        'phone',
        'address',
        'password',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function scopePhone($query, $phone) 
    {
        return $query->where('phone', 'LIKE', '%'.$phone.'%');
    }

    public function scopeEmail($query, $email) 
    {
        return $query->where('email', 'LIKE', '%'.$email.'%');
    }

    public function favourites()
    {
        return $this->hasMany(UserFavourite::class, 'userId');
    }

    public function cartItems()
    {
        return $this->hasMany(Cart::class, 'userId', 'id');
    }

    public function coupons()
    {
        return $this->belongsToMany(Coupon::class, 'user_coupons', 'userId', 'couponId')->wherePivot('quantity', '>', 0);
    }

    public function receipts()
    {
        return $this->hasMany(Receipt::class, 'userId', 'id');
    }
}
