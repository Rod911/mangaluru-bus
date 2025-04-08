<?php

namespace App\Http\Formatters;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Paginate {
    /**
     * format
     *
     * @param Request $request
     * @param class-string<Model> $model
     * @param Builder $collection
     * @param string[]|string|null $search
     * @param string|null $groupKey
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public static function format(Request $request, string $model, Builder $collection, $search = null, $groupKey = null) {
        $page = $request->page ?? 1;
        $pageSize = $request->pageSize ?? 10;
        $query = $request->search ?? '';

        $collection = $collection
            ->limit($pageSize)
            ->offset(($page - 1) * $pageSize);
        if ($search) {
            if (!is_array($search)) $search = [$search];
            $collection->whereAny($search, 'like', '%' . $query . '%');
        }

        if ($groupKey) {
            $collection = $collection->groupBy($groupKey);
        }

        $collection = $collection->get();
        $filteredTotal = $model::whereAny($search, 'like', '%' . $query . '%')->count();
        $total = $model::count();

        return response()->json([
            'data' => $collection,
            'pagination' => [
                'total' => $total,
                'filtered_total' => $filteredTotal,
                'current_page' => (int) $page,
                'per_page' => (int) $pageSize,
                'query' => $query,
            ]
        ]);
    }
}
