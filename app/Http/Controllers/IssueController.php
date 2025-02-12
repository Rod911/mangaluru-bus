<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class IssueController extends Controller {
    public function index() {
        return Inertia::render('admin/issues/Issues', [
            'issues' => Issue::latest()->get(),
        ]);
    }

    public function destroy(Request $request) {
        $issue = Issue::find($request->id);
        $issue->delete();
        $delete = Storage::disk('public')->delete($issue->image);
        return redirect(route('issues.view'));
    }
}
