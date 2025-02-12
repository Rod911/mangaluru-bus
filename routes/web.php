<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\IssueController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RouteController;
use App\Models\Location;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'app_name' => env('APP_NAME'),
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'locations' => Location::orderBy('location_name')->get(),
    ]);
});

Route::get('/search', [HomeController::class, 'search'])->name('search');
Route::get('/report-issue', [HomeController::class, 'reportIssue'])->name('report-issue');
Route::post('/report-issue', [HomeController::class, 'storeReportIssue'])->name('report-issue.store');

Route::prefix('admin')->group(function () {
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/', function () {
            return Inertia::render('admin/Dashboard');
        })->name('dashboard');

        Route::prefix('locations')
            ->group(function () {
                Route::get('/', [LocationController::class, 'index'])->name('locations.view');
                Route::get('create', [LocationController::class, 'create'])->name('locations.create');
                Route::post('store', [LocationController::class, 'store'])->name('locations.store');
                Route::get('edit', [LocationController::class, 'edit'])->name('locations.edit');
                Route::patch('update', [LocationController::class, 'update'])->name('locations.update');
                Route::delete('destroy', [LocationController::class, 'destroy'])->name('locations.destroy');
            });

        Route::prefix('routes')
            ->group(function () {
                Route::get('/', [RouteController::class, 'index'])->name('routes.view');
                Route::get('create', [RouteController::class, 'create'])->name('routes.create');
                Route::post('store', [RouteController::class, 'store'])->name('routes.store');
                Route::get('edit', [RouteController::class, 'edit'])->name('routes.edit');
                Route::patch('update', [RouteController::class, 'update'])->name('routes.update');
                Route::delete('destroy', [RouteController::class, 'destroy'])->name('routes.destroy');
                // Route::get('fill', [RouteController::class, 'fill'])->name('routes.fill');
            });

        Route::prefix('issues')
            ->group(function () {
                Route::get('/', [IssueController::class, 'index'])->name('issues.view');
                Route::delete('destroy', [IssueController::class, 'destroy'])->name('issues.destroy');
            });
    });

    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });
});

require __DIR__ . '/auth.php';
