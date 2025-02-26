<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use App\Http\Formatters\Paginate;
use App\Http\Requests\Admin\Issues\DestroyIssueRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class IssueController extends Controller {
    public function index() {
        return Inertia::render('admin/issues/Issues');
    }

    public function paginateIssues(Request $request) {
        $issues = Issue::orderBy('created_at', 'desc');
        return Paginate::format($request, Issue::class, $issues, 'description');
    }

    public function destroy(DestroyIssueRequest $request) {
        $issue = Issue::find($request->id);
        if ($issue) {
            $issue->delete();
            if ($issue->image != null) {
                $delete = Storage::disk('public')->delete($issue->image);
            }
        }
        return redirect(route('issues.view'));
    }

    public function toggleTag(Request $request) {
        $issue = Issue::find($request->id);
        $issue->status = $request->action;
        $issue->save();
        return redirect(route('issues.view'));
    }
}
