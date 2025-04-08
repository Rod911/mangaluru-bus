<?php

use App\Models\Location;
use App\Models\SearchLog;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration {
    public function up(): void {
        DB::transaction(function () {
            Schema::table('locations', function (Blueprint $table) {
                $table->string('url_slug', 50)->nullable()->unique();
            });
            // $locs = Location::get();
            // foreach ($locs as $location) DB::table('locations')->where('uuid', $location->uuid)->update(['url_slug' => Str::of($location->location_name)->slug('-')]);
            // SearchLog::where('type', 'location')->get()->load(['fromLocation', 'toLocation'])->each(function ($log) {
            //     if ($log->fromLocation->url_slug === null || $log->toLocation->url_slug === null) {
            //         throw new Exception('Location slugs not generated');
            //     }
            //     $log->update([
            //         'from' => $log->fromLocation->url_slug,
            //         'to' => $log->toLocation->url_slug,
            //     ]);
            // });
        });
    }

    public function down(): void {
        // SearchLog::where('type', 'location')->with(['fromLocation', 'toLocation'])->each(function ($log) {
        //     $log->update([
        //         'from' => $log->fromLocation->uuid,
        //         'to' => $log->toLocation->uuid,
        //     ]);
        // });
        Schema::table('locations', function (Blueprint $table) {
            $table->dropColumn('url_slug');
        });
    }
};
