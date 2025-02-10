<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('route_stops', function (Blueprint $table) {
            $table->unique(['route_id', 'location_id',], 'route_locations');
        });
    }

    public function down(): void {
        Schema::table('route_stops', function (Blueprint $table) {
            $table->dropUnique('route_locations');
        });
    }
};
