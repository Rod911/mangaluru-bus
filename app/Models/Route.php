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

    protected $casts = [
        'has_local' => 'boolean',
        'has_govt' => 'boolean',
        'has_express' => 'boolean',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function routeStops(): HasMany {
        return $this->hasMany(RouteStop::class, 'route_id', 'uuid');
    }
}
