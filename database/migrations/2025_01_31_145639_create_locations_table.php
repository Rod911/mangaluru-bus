<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('locations', function (Blueprint $table) {
            $table->uuid()->primary();
            $table->string('location_name', 50)->unique();
            $table->string('address', 250);
            $table->timestamps();
        });

        Schema::create('bus_stops', function (Blueprint $table) {
            $table->uuid()->primary();
            $table->foreignUuid('location_id')->constrained('locations', 'uuid')->cascadeOnDelete();
            $table->string('stop_description', 250);
            $table->boolean('is_two_way')->default(true);
            $table->geography('coordinates')->nullable();
            $table->timestamps();
        });

        Schema::create('routes', function (Blueprint $table) {
            $table->uuid()->primary();
            $table->string('route_name', 50)->unique();
            $table->boolean('has_local')->default(false);
            $table->boolean('has_govt')->default(false);
            $table->boolean('has_express')->default(false);
            $table->enum('direction', ['up', 'down', 'both'])->default('both');
        });

        Schema::create('route_stops', function (Blueprint $table) {
            $table->integer('order');
            $table->foreignUuid('route_id')->constrained('routes', 'uuid')->cascadeOnDelete();
            $table->unique(['route_id', 'order'], 'route_stop_sequence');
            $table->foreignUuid('location_id')->constrained('locations', 'uuid')->cascadeOnDelete();
            $table->foreignUuid('bus_stop_id')->nullable()->constrained('bus_stops', 'uuid')->cascadeOnDelete();
        });
    }

    public function down(): void {
        Schema::dropIfExists('route_stops');
        Schema::dropIfExists('routes');
        Schema::dropIfExists('bus_stops');
        Schema::dropIfExists('locations');
    }
};
