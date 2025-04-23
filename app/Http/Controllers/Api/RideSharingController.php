<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Trip;
use Illuminate\Http\Request;
use App\Repositories\TripRepository;
use App\Services\FareCalculatorService;
use App\Models\User;
use App\Models\VehicleType;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class RideSharingController extends Controller
{
    protected $fareCalculatorService;
    protected $tripRepository;

    public function __construct(FareCalculatorService $fareCalculatorService, TripRepository $tripRepository)
    {
        $this->fareCalculatorService = $fareCalculatorService;
        $this->tripRepository = $tripRepository;
    }

    public function calculateFare(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'distance' => 'required|numeric|min:0.1',
            'vehicle_type_id' => 'required|exists:vehicle_types,id',
            'user_id' => 'nullable|exists:users,id', 
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $distance = $request->input('distance');
            $vehicleType = VehicleType::findOrFail($request->input('vehicle_type_id'));
            $user = $request->has('user_id') ? User::find($request->input('user_id')) : null;

            $fare = $this->fareCalculatorService->calculate($distance, $vehicleType, $user);

            $this->fareCalculatorService->resetRequestCount();

            //store trip details in the database
            if ($user) {
                $trip = $this->tripRepository->create($user, $vehicleType, $distance, $fare);
            }

            return response()->json(['fare' => $fare]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function storeTrip(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'distance' => 'required|numeric|min:0.1',
            'vehicle_type_id' => 'required|exists:vehicle_types,id',
            'user_id' => 'required|exists:users,id',
            'fare' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::findOrFail($request->input('user_id'));
        $vehicleType = VehicleType::findOrFail($request->input('vehicle_type_id'));
        $distance = $request->input('distance');
        $fare = $request->input('fare');

        $trip = $this->tripRepository->create($user, $vehicleType, $distance, $fare);

        return response()->json(['trip' => $trip], 201);
    }

    public function getVehicleTypes(): JsonResponse
    {
        $vehicleTypes = VehicleType::all();

        return response()->json(['vehicle_types' => $vehicleTypes]);
    }

    public function getTrips(Request $request): JsonResponse
    {
        $trips = Trip::with(['user', 'vehicleType'])
            ->when($request->has('user_id'), function ($query) use ($request) {
                return $query->where('user_id', $request->input('user_id'));
            })
            ->when($request->has('vehicle_type_id'), function ($query) use ($request) {
                return $query->where('vehicle_type_id', $request->input('vehicle_type_id'));
            })
            ->get();

        return response()->json(['trips' => $trips]);
    }

    public function getUsers(Request $request): JsonResponse
    {
        $users = User::where('name', 'like', '%' . $request->input('name') . '%')
            ->orWhere('email', 'like', '%' . $request->input('email') . '%')
            ->get();

        return response()->json(['users' => $users]);
    }
}
