<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SearchLog extends Model {
    protected $fillable = [
        'type',
        'from',
        'to',
        'route',
        'ip',
        'user_agent',
    ];

    protected $hidden = [
        'id',
        'from',
        'to',
        'ip',
        'user_agent',
        'created_at',
        'updated_at',
    ];

    public function fromLocation(): BelongsTo {
        return $this->belongsTo(Location::class, 'from', 'url_slug');
    }

    public function toLocation(): BelongsTo {
        return $this->belongsTo(Location::class, 'to', 'url_slug');
    }
}
