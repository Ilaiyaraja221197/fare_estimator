import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import FareCalculator from './FareCalculator';
import TripList from './TripList';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <FareCalculator />
                        
                    </div>
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg mt-4">
                        <TripList />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
