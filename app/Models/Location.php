<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Location extends Model {
    use HasUuids;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $primaryKey = 'uuid';

    protected $fillable = [
        'location_name',
        'address',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function busStops(): HasMany {
        return $this->hasMany(BusStop::class, 'location_id', 'uuid');
    }

    public function routeStops(): HasMany {
        return $this->HasMany(RouteStop::class, 'location_id', 'uuid');
    }

    public function routes(): HasManyThrough {
        return $this->hasManyThrough(Route::class, RouteStop::class, 'location_id', 'uuid', 'uuid', 'route_id');
    }
}
