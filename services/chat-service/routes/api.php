<?php

use App\Http\Controllers\ChatController;
use App\Http\Controllers\GoogleCalendarController;
use Illuminate\Support\Facades\Route;

Route::post('/chat/message', [ChatController::class, 'sendMessage']);
Route::get('/chat/todos', [ChatController::class, 'todos']);
Route::get('/chat/admin-todos', [ChatController::class, 'adminTodos']);
Route::post('/chat/todos/{id}/handled', [ChatController::class, 'markHandled']);
// ✅ Nouvelles routes Google Calendar
Route::get('/google/connect', [GoogleCalendarController::class, 'connect']);
Route::get('/google/callback', [GoogleCalendarController::class, 'callback']);
Route::get('/google/status', [GoogleCalendarController::class, 'status']);
Route::post('/chat/select-slot', [GoogleCalendarController::class, 'selectSlot']);
