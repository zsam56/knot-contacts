<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Contact;
use Illuminate\Support\Facades\Auth;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('user.contacts.{userId}', function ($user, $userId) {
    // Ensure that only the authenticated user can listen to their own channel
    Log::info('CHANNEL');
    Log::info($userId);
    Log::info($user->id);
    return (int) $user->id === (int) $userId;
});