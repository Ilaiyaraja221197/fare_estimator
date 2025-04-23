<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'vehicle_type_id',
        'distance',
        'fare',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function vehicleType()
    {
        return $this->belongsTo(VehicleType::class);
    }
}
