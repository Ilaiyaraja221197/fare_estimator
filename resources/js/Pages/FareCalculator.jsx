import React, { useState, useEffect, useCallback } from 'react';

function FareCalculator() {
    const [distance, setDistance] = useState('');
    const [vehicleTypeId, setVehicleTypeId] = useState('');
    const [userId, setUserId] = useState('');
    const [fare, setFare] = useState(null);
    const [error, setError] = useState('');
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [showUserList, setShowUserList] = useState(false);
    const [selectedUserName, setSelectedUserName] = useState(''); // Track selected user name


    useEffect(() => {
        const fetchVehicleTypes = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/vehicle-types');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setVehicleTypes(data.vehicle_types);
            } catch (error) {
                console.error("Could not fetch vehicle types:", error);
                setError("Failed to load vehicle types.");
            }
        };

        fetchVehicleTypes();
    }, []);

    const handleCalculateFare = async () => {
        setError('');
        setFare(null);
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/calculate-fare', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    distance: parseFloat(distance),
                    vehicle_type_id: parseInt(vehicleTypeId),
                    user_id: userId ? parseInt(userId) : null,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setFare(data.fare);
            } else {
                if (data.errors) {
                    setError(Object.values(data.errors).flat().join(' '));
                } else if (data.error) {
                    setError(data.error);
                } else {
                    setError('An unexpected error occurred.');
                }
            }
        } catch (err) {
            console.error("Error calculating fare:", err);
            setError('Failed to connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = useCallback(async (name) => {
        if (!name) {
            setUsers([]);
            setShowUserList(false);
            return;
        }
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/users?name=${name}`); // Adjust the API endpoint
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setUsers(data.users);
            setShowUserList(true);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to fetch users.");
            setUsers([]); // Clear user list on error
            setShowUserList(false);
        }
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers(searchTerm);
        }, 300); // Debounce delay of 300ms

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, fetchUsers]);

    const handleUserSelect = (user) => {
        setUserId(user.id);
        setSelectedUserName(user.name); // Store selected user name
        setSearchTerm('');        // Clear search term
        setShowUserList(false);
    };

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-2xl font-bold mb-4">Fare Estimation</h2>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline">{error}</span>
            </div>}

            <div className="mb-4">
                <label htmlFor="distance" className="block text-gray-700 text-sm font-bold mb-2">Distance (in km):</label>
                <input
                    type="number"
                    id="distance"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="e.g., 10.5"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="vehicleType" className="block text-gray-700 text-sm font-bold mb-2">Vehicle Type:</label>
                <select
                    id="vehicleType"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={vehicleTypeId}
                    onChange={(e) => setVehicleTypeId(e.target.value)}
                >
                    <option value="">Select Vehicle Type</option>
                    {vehicleTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                </select>
                {vehicleTypes.length === 0 && !error && <p className="text-gray-500 text-xs italic">Loading vehicle types...</p>}
            </div>

            <div className="mb-4">
                <label htmlFor="userName" className="block text-gray-700 text-sm font-bold mb-2">User Name (for discount):</label>
                <input
                    type="text"
                    id="userName"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setSelectedUserName(''); // Clear selected name when typing
                        setUserId('');
                    }}
                    placeholder="Enter user name"
                />
                {selectedUserName && (
                    <p className="text-green-500 text-xs italic">Selected User: {selectedUserName}</p>
                )}
                {showUserList && (
                    <ul className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full">
                        {users.length > 0 ? (
                            users.map(user => (
                                <li
                                    key={user.id}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleUserSelect(user)}
                                >
                                    {user.name}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500">No users found</li>
                        )}
                    </ul>
                )}
                <input
                    type="hidden"  // Hidden input to store the user ID
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)} // Keep the hidden input updated.
                />

                <p className="text-gray-500 text-xs italic">Start typing a user name to select a user for the first-time user discount.</p>
            </div>

            <button
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                type="button"
                onClick={handleCalculateFare}
                disabled={loading}
            >
                {loading ? 'Calculating...' : 'Calculate Fare'}
            </button>

            {fare !== null && (
                <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded relative" role="alert">
                    <strong className="font-bold">Estimated Fare:</strong>
                    <span className="ml-2">${fare.toFixed(2)}</span>
                </div>
            )}
        </div>
    );
}

export default FareCalculator;
