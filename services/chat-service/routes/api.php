<?php

use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Route;

Route::post('/chat/message', [ChatController::class, 'sendMessage']);
Route::get('/chat/todos', [ChatController::class, 'todos']);
Route::get('/chat/admin-todos', [ChatController::class, 'adminTodos']);
Route::post('/chat/todos/{id}/handled', [ChatController::class, 'markHandled']);
