<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Issue extends Model {
    protected $fillable = [
        'type',
        'description',
        'image',
        'contact',
        'status',
        'notes',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
