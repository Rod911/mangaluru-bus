<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RouteStop extends Model {
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'order',
        'route_id',
        'location_id',
        'bus_stop_id',
    ];

    // public function route(): BelongsTo {
    //     return $this->belongsTo(Route::class);
    // }

    public function location(): BelongsTo {
        return $this->belongsTo(Location::class, 'location_id', 'uuid');
    }

    public function busStop(): BelongsTo {
        return $this->belongsTo(BusStop::class, 'bus_stop_id', 'uuid');
    }
}
