<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('issues', function (Blueprint $table) {
            $table->id();
            $table->string('type')->default('other'); // incorrect_route | site_issue | other
            $table->text('description');
            $table->string('image')->nullable();
            $table->string('contact')->nullable();
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('issues');
    }
};
