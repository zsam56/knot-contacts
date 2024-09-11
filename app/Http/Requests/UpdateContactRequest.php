<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use App\Models\Contact;

class UpdateContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $contact = $this->route("contact");
        return [
            "first_name" => ['required', 'max:255'],
            "last_name" => ['required', 'max:255'],
            "email" => [
                'required', 
                'email', 
                function ($attribute, $value, $fail) use ($contact) {
                    // Check if the email already exists for the current user, excluding current contact
                    $exists = Contact::where('created_by', Auth::id())
                                    ->where('id', '!=', $contact->id) 
                                    ->where('email', $value)
                                    ->exists();
                
                    if ($exists) {
                        $fail('You already have a contact with this email.');
                    }
                }
            ],
            "phone_number" => ['required', 'max:10']
        ];
    }

    /**
     * Customize the error messages for the validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'email.required' => 'The email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'There is already a contact with this email address.'
        ];
    }
}
