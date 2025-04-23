<?php

namespace App\Repositories;

use App\Models\Trip;
use App\Models\User;
use App\Models\VehicleType;

class TripRepository
{
    public function create(User $user, VehicleType $vehicleType, float $distance, float $fare): Trip
    {
        return Trip::create([
            'user_id' => $user->id,
            'vehicle_type_id' => $vehicleType->id,
            'distance' => $distance,
            'fare' => $fare,
        ]);
    }
}