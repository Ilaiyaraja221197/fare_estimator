<?php

use App\Http\Controllers\Api\RideSharingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/calculate-fare', [RideSharingController::class,'calculateFare']);
Route::post('/trip', [RideSharingController::class, 'storeTrip']);
Route::get('/vehicle-types', [RideSharingController::class, 'getVehicleTypes']);
Route::get('/trips', [RideSharingController::class, 'getTrips']);
Route::get('/users', [RideSharingController::class, 'getUsers']);