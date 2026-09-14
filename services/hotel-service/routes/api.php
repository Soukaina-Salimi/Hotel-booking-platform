<?php

use App\Http\Controllers\HotelController;
use App\Http\Controllers\RoomController;
use Illuminate\Support\Facades\Route;

// Prefixe /api/ deja gere par Nginx qui route /api/hotels/ vers ce service -
// ici les routes sont definies sans le prefixe "hotels" en trop puisque
// Laravel recoit deja la requete sur /api/hotels/... via le reverse proxy.
// A adapter selon la config exacte de app/Http/Kernel ou bootstrap/app.php
// (api routes montees sur /api par defaut dans Laravel 11).

Route::get('/hotels', [HotelController::class, 'index']);
Route::post('/hotels', [HotelController::class, 'store']);
Route::get('/hotels/mine', [HotelController::class, 'mine']); // avant {id} pour eviter que "mine" soit capture comme un id
Route::get('/hotels/{id}', [HotelController::class, 'show']);
Route::post('/hotels/{id}', [HotelController::class, 'update']); // POST + _method=PUT cote frontend (upload de fichier)
Route::get('/rooms', [RoomController::class, 'index']);
Route::post('/rooms', [RoomController::class, 'store']);
Route::get('/rooms/{id}', [RoomController::class, 'show']);
Route::post('/rooms/{id}', [RoomController::class, 'update']); // spoof PUT
Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);
