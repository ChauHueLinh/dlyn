<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;

    const PARENT_ID = 0;

    protected $fillable = [
        'name',
        'displayName',
        'parentId',
    ];

    public function childrent()
    {
        return $this->hasMany(Permission::class, 'parentId', 'id');
    }
}
