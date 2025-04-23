import React, { useState, useEffect } from 'react';

function TripList() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/trips'); 
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTrips(data.trips);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>Loading trips...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <p>No trips found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Trip List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full leading-normal shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                User ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                User Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                Vehicle Type
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                Distance (km)
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                Fare ($)
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {trips.map((trip) => (
              <tr key={trip.id}>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{trip.id}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{trip.user_id}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{trip.user?.name || ''}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{trip.vehicle_type?.name || 'N/A'}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{trip.distance}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{trip.fare}</td>
                <td className="px-5 py-5 border-b border-gray-200 text-sm">{new Date(trip.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TripList;
