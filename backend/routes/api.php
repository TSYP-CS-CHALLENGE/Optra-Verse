<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Middleware\InjectJwtFromCookie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')->group(function () {
    Route::post("register", [AuthController::class, 'register']);
    Route::post("login", [AuthController::class, 'login']);
    Route::post("refresh", [AuthController::class, 'refresh']);
    Route::post("logout", [AuthController::class, 'logout']);
});

Route::middleware([InjectJwtFromCookie::class, 'auth:api'])->group(function () {
    Route::get("/me", [AuthController::class, "me"]);
});
