<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class IssueController extends Controller {
    public function index() {
        return Inertia::render('admin/issues/Issues');
    }

    public function paginateIssues(Request $request) {
        $page = $request->page ?? 1;
        $pageSize = $request->pageSize ?? 10;
        $query = $request->search ?? '';
        $issues = Issue::orderBy('description')
            ->limit($pageSize)
            ->offset(($page - 1) * $pageSize)
            ->where('description', 'like', '%' . $query . '%')
            ->get();
        return response()->json([
            'data' => $issues,
            'pagination' => [
                'total' => Issue::where('description', 'like', '%' . $query . '%')->count(),
                'current_page' => (int) $page,
                'per_page' => (int) $pageSize
            ]
        ]);
    }

    public function destroy(Request $request) {
        $issue = Issue::find($request->id);
        $issue->delete();
        $delete = Storage::disk('public')->delete($issue->image);
        return redirect(route('issues.view'));
    }
}
