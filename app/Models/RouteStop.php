<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

class RouteStop extends Model {
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'order',
        'route_id',
        'location_id',
        'bus_stop_id',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function route(): BelongsTo {
        return $this->belongsTo(Route::class, 'route_id', 'uuid');
    }

    public function location(): BelongsTo {
        return $this->belongsTo(Location::class, 'location_id', 'uuid');
    }

    public function busStop(): BelongsTo {
        return $this->belongsTo(BusStop::class, 'bus_stop_id', 'uuid');
    }

    public function defaultBusStop(): HasOneThrough {
        return $this->hasOneThrough(BusStop::class, Location::class, 'uuid', 'location_id', 'location_id', 'uuid');
    }
}
