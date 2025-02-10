<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Route extends Model {
    use HasUuids;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $primaryKey = 'uuid';

    protected $fillable = [
        'route_name',
        'has_local',
        'has_govt',
        'has_express',
        'direction',
    ];

    public function routeStops(): HasMany {
        return $this->hasMany(RouteStop::class, 'route_id', 'uuid');
    }
}
