<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactEdit extends Model
{
    use HasFactory;

    protected $fillable = ['first_name', 'last_name', 'email', 'phone_number', 'created_by', 'contact_id'];

    public function createdBy() {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function contactId() {
        return $this->belongsTo(Contact::class, 'contact_id');
    }
}
