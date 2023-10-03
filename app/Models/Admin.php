<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use HasFactory, Notifiable;

    const DEFAULT_IMG = 'assets/img/default-avatar.png';
    const ACTIVATE = 1;
    const DEACTIVATE = 0;

    const LIST_STATUS = [
        self::ACTIVATE => 'Kích hoạt',
        self::DEACTIVATE => 'Tắt kích hoạt',
    ];

    const FOLDER = 'admin';

    protected $fillable = [
        'name',
        'email',
        'status',
        'roleId',
        'password',
        'phone',
        'avatar',
    ];

    protected $hidden = [
        'password'
    ];

    public function role()
    {
        return $this->belongsTo(Role::class, 'roleId', 'id');
    }

    public function hasRoles($permission)
    {
        $auth_permissions = auth()->user()->role ? auth()->user()->role->permissions->pluck('key') : [];
        
        if (count($auth_permissions) > 0 && $auth_permissions->contains($permission)) {
            return true;
        }

        return false;
    }
}
