<?php

namespace App\Models;

use App\Casts\Coordinates;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class BusStop extends Model {
    use HasUuids;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $primaryKey = 'uuid';

    protected $fillable = [
        'stop_description',
        'is_two_way',
        'coordinates',
    ];

    protected $spatialFields = [
        'coordinates',
    ];

    protected $casts = [
        'is_two_way' => 'boolean',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    protected function casts(): array {
        return [
            'coordinates' => Coordinates::class,
        ];
    }
}
