<?php

namespace App\Services;

use App\Models\User;
use App\Models\VehicleType;

class FareCalculatorService
{

  protected $surgeThreshold = 5;
  protected $requestTimestamps = [];

  public function calculate(float $distance, VehicleType $vehicleType, User $user = null): float
  {
    if ($distance > 500) {
      throw new \Exception('Maximum trip distance exceeded.');
    }

    $this->incrementRequestCount();

    $fare = $vehicleType->base_fare + ($distance * $vehicleType->cost_per_km);

    if ($this->shouldApplySurge()) {
      $fare *= 1.5;
    }

    if ($user && $user->trips()->count() === 0) {
      $fare *= 0.9; // 10% discount
    }

    return round($fare, 2);
  }


  public function incrementRequestCount(): void
  {
    $currentTime = time();
    $this->requestTimestamps[] = $currentTime;

    $this->requestTimestamps = array_filter($this->requestTimestamps, function ($timestamp) use ($currentTime) {
      return ($currentTime - $timestamp) <= 60;
    });

  }

  public function resetRequestCount(): void
  {
    $this->requestTimestamps = [];
  }

  protected function shouldApplySurge(): bool
  {
    return count($this->requestTimestamps) > $this->surgeThreshold;
  }
}
