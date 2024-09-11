<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use App\Models\Contact;
use App\Models\ContactEdit;
use App\Http\Resources\ContactResource;
use App\Http\Resources\ContactEditResource;
use App\Events\ContactUpdated;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");
        $query = Contact::query()->where('created_by', Auth::id());
        $contacts = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)->onEachSide(1);

        return inertia("Contact/Index", [
            "contacts" => ContactResource::collection($contacts)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("Contact/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContactRequest $request)
    {
        // simulating a 20-second delay
        // sleep(20);

        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $data['last_updated_by'] = Auth::id();
        Contact::create($data);

        return to_route('contact.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        ContactUpdated::dispatch($contact);
        
        // handle querying the edit history for the contact
        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");
        $query = ContactEdit::query()->where('contact_id', $contact->id);
        $contactEdits = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)->onEachSide(1);

        return inertia('Contact/Show', [
            'contact' => new ContactResource($contact),
            'contactEdits' => ContactEditResource::collection($contactEdits)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Contact $contact)
    {
        return inertia('Contact/Edit', [
            'contact' => new ContactResource($contact)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateContactRequest $request, Contact $contact)
    {
        $data = $request->validated();
        $contact->update($data);

        // create the contact edit
        $data['created_by'] = Auth::id();
        $data['contact_id'] = $contact->id;
        ContactEdit::create($data);

        // dispatch an update event
        ContactUpdated::dispatch($contact);
        Log::info('Event dispatched');

        return to_route('contact.index')->with('success', "Contact updated");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        $contact->delete();
        return to_route('contact.index')->with('success', 'Contact successfully deleted.');
    }
}
