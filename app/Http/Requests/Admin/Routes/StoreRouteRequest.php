<?php

namespace App\Http\Requests\Admin\Routes;

use App\Models\Route;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRouteRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        return [
            'routeName' => [
                'required',
                'string',
                'max:50',
                Rule::unique(Route::class),
            ],
            'hasLocal' => [],
            'hasGovt' => [],
            'hasExpress' => [],
            'routeStops' => []
        ];
    }
}
