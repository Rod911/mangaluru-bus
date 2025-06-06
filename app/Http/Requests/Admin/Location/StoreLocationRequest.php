<?php

namespace App\Http\Requests\Admin\Location;

use App\Models\Location;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLocationRequest extends FormRequest {
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
            'locationName' => [
                'required',
                'string',
                'max:50',
                Rule::unique(Location::class),
            ],
            'locationAddress' => [
                'nullable',
                'string',
                'max:250',
            ],
        ];
    }
}
