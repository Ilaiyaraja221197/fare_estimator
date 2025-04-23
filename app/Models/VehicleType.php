<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VehicleType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'base_fare',
        'cost_per_km',
    ];

    public function trips()
    {
        return $this->hasMany(Trip::class);
    }

}
