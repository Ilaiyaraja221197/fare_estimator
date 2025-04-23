<?php

namespace Database\Seeders;

use App\Models\VehicleType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VehicleTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        VehicleType::create(['name' => 'Economy', 'base_fare' => 5, 'cost_per_km' => 1]);
        VehicleType::create(['name' => 'Standard', 'base_fare' => 8, 'cost_per_km' => 1.5]);
        VehicleType::create(['name' => 'Luxury', 'base_fare' => 12, 'cost_per_km' => 2]);
    }
}
