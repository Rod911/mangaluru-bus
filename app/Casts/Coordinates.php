<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class Coordinates implements CastsAttributes {
    /**
     * Cast the given value.
     *
     * @param  array<string, mixed>  $attributes
     * @return array<string, mixed>
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): array {
        @[$latitude, $longitude] = preg_split('/\s+/', $value ?? " ");
        $latitude = $latitude ? floatval($latitude) : null;
        $longitude = $longitude ? floatval($longitude) : null;
        return @compact('latitude', 'longitude');
    }
    /**
     * Prepare the given value for storage.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): mixed {
        return $value ? `ST_GeomFromText('POINT('` . (join(' ', $value)) . `')', 4326)` : null;
    }
}
