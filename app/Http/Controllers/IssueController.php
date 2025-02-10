<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use Inertia\Inertia;

class IssueController extends Controller {
    public function index() {
        return Inertia::render('admin/issues/Issues', [
            'issues' => Issue::get(),
        ]);
    }
}
