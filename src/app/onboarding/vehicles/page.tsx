'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Plus } from 'lucide-react';
import { CompleteOrder } from '@/app/components/CompleteOrder';
import { useVehicleStore, Vehicle } from '@/app/stores/useVehicleStore';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { useDemoStore } from '@/app/stores/useDemoStore';

const defaultVehicle: Omit<Vehicle, 'id'> = {
  name: '',
  type: 'car',
  status: 'active',
  licensePlate: '',
  vin: '',
  model: '',
  year: new Date().getFullYear().toString(),
  capacity: 5,
  fuelType: 'gasoline',
  mileage: 0,
  fuelLevel: 100,
  trackingDevice: {
    type: 'GPS',
    serialNumber: '',
  },
  insurance: {
    provider: 'Demo Insurance',
    policyNumber: '',
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
  },
  documents: [],
};

export default function Vehicles() {
  const router = useRouter();
  const { isDemoMode } = useDemoAuth();
  const { vehicles, addVehicle, deleteVehicle } = useVehicleStore();
  const { addVehicle: addDemoVehicle, vehiclesList: demoVehicles } = useDemoStore();
  
  // Use demo vehicles if in demo mode
  const displayVehicles = isDemoMode() ? demoVehicles : vehicles;
  const [showForm, setShowForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState(defaultVehicle);

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemoMode()) {
      addDemoVehicle(newVehicle);
    } else {
      addVehicle(newVehicle);
    }

    setNewVehicle(defaultVehicle);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/onboarding/finalize');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 relative pt-4">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(37,99,235,0.08),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(37,99,235,0.15),rgba(0,0,0,0))]" />
        <div className="animate-pulse absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl" />
        <div className="animate-pulse absolute -bottom-20 right-1/4 w-96 h-96 bg-cyan-300/5 dark:bg-cyan-300/10 rounded-full blur-3xl" />
        <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-blue-600/10 dark:via-blue-600/20 to-transparent top-1/3" />
      </div>

      {/* Main Content */}
      <div className="relative backdrop-blur-xl bg-white/90 dark:bg-black/50 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-blue-900/10 mb-6 overflow-hidden">
        {/* Inner glass highlights */}
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/50 to-white/70 dark:from-black/90 dark:via-black/50 dark:to-black/70 opacity-80" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-600/5 via-cyan-300/3 to-transparent dark:from-blue-600/10 dark:via-cyan-300/5 dark:to-transparent opacity-30" />
        </div>

        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
          <h2 className="text-2xl font-bold">
            Demo Mode: Add Vehicles
          </h2>
          <p className="mt-1 opacity-90">Set up your fleet by adding vehicles</p>
          <div className="mt-2 px-3 py-1.5 bg-blue-500/20 rounded-lg inline-block">
            <span className="text-sm font-medium">Demo Mode Active - Features shown for demonstration only</span>
          </div>
        </div>

        <div className="p-6">
          {/* Demo Notice - Highlighted Info Box */}
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 border border-amber-200 dark:border-amber-700/50 rounded-lg shadow-md animate-pulse">
            <div className="flex items-start gap-3">
              <div className="text-amber-600 dark:text-amber-400 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">Demo Account Notice</h4>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-200">
                  This is a demonstration account. You can explore the interface and see how vehicle management works, but no actual vehicles will be added to the system. Feel free to interact with the forms to experience the full functionality.
                </p>
              </div>
            </div>
          </div>

          {/* Vehicle List */}
          <div className="mt-4">
            {displayVehicles.length > 0 ? (
              <div className="backdrop-blur-xl bg-white/90 dark:bg-black/50 rounded-xl divide-y divide-gray-200 dark:divide-gray-800 border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
                {displayVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="p-6 flex items-center justify-between hover:bg-white/50 dark:hover:bg-black/50 transition-colors duration-200"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-foreground">
                        {vehicle.name}
                      </h3>
                      <div className="mt-1 text-sm text-muted-foreground space-y-1">
                        <p>Type: {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}</p>
                        <p>License Plate: {vehicle.licensePlate}</p>
                        <p>Model: {vehicle.model} ({vehicle.year})</p>
                        {vehicle.trackingDevice && (
                          <p>
                            Tracking Device: {vehicle.trackingDevice.type} - {vehicle.trackingDevice.serialNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteVehicle(vehicle.id)}
                      className="text-sm text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="backdrop-blur-xl bg-white/90 dark:bg-black/50 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
                <div className="mb-4">
                  <Car className="w-12 h-12 text-blue-600/50 dark:text-blue-400/50 mx-auto" />
                </div>
                <p className="text-muted-foreground">No vehicles added yet</p>
                <p className="text-sm text-muted-foreground/60 mt-1">Add your first vehicle to get started</p>
              </div>
            )}
          </div>

          {/* Add Vehicle Form */}
          {showForm ? (
            <div className="mt-8 backdrop-blur-xl bg-white/90 dark:bg-black/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
              <form onSubmit={handleAddVehicle} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-foreground">
                      Vehicle Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={newVehicle.name}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 block w-full rounded-lg border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-foreground">
                      Type
                    </label>
                    <select
                      id="type"
                      value={newVehicle.type}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, type: e.target.value as Vehicle['type'] }))}
                      className="mt-1 block w-full rounded-lg border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-200"
                    >
                      <option value="car">Car</option>
                      <option value="truck">Truck</option>
                      <option value="van">Van</option>
                      <option value="bus">Bus</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="licensePlate" className="block text-sm font-medium text-foreground">
                      License Plate
                    </label>
                    <input
                      type="text"
                      id="licensePlate"
                      required
                      value={newVehicle.licensePlate}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, licensePlate: e.target.value }))}
                      className="mt-1 block w-full rounded-lg border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-foreground">
                      Model
                    </label>
                    <input
                      type="text"
                      id="model"
                      required
                      value={newVehicle.model}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, model: e.target.value }))}
                      className="mt-1 block w-full rounded-lg border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-foreground">
                      Year
                    </label>
                    <input
                      type="number"
                      id="year"
                      required
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={newVehicle.year}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, year: e.target.value }))}
                      className="mt-1 block w-full rounded-lg border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="vin" className="block text-sm font-medium text-foreground">
                      VIN Number
                    </label>
                    <input
                      type="text"
                      id="vin"
                      required
                      value={newVehicle.vin}
                      onChange={(e) => setNewVehicle(prev => ({ ...prev, vin: e.target.value }))}
                      className="mt-1 block w-full rounded-lg border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="deviceType" className="block text-sm font-medium text-foreground">
                      Tracking Device Type
                    </label>
                    <select
                      id="deviceType"
                      value={newVehicle.trackingDevice.type}
                      onChange={(e) => setNewVehicle(prev => ({
                        ...prev,
                        trackingDevice: {
                          ...prev.trackingDevice,
                          type: e.target.value as 'GPS' | 'IoT'
                        }
                      }))}
                      className="mt-1 block w-full rounded-lg border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-200"
                    >
                      <option value="GPS">GPS</option>
                      <option value="IoT">IoT</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="serialNumber" className="block text-sm font-medium text-foreground">
                      Device Serial Number
                    </label>
                    <input
                      type="text"
                      id="serialNumber"
                      required
                      value={newVehicle.trackingDevice.serialNumber}
                      onChange={(e) => setNewVehicle(prev => ({
                        ...prev,
                        trackingDevice: {
                          ...prev.trackingDevice,
                          serialNumber: e.target.value
                        }
                      }))}
                      className="mt-1 block w-full rounded-lg border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-200"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 text-sm font-medium bg-white dark:bg-black text-foreground border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                    >
                      Add Vehicle
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="mt-8">
              <div className="backdrop-blur-xl bg-white/90 dark:bg-black/50 rounded-xl p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-blue-400 transition-all duration-200">
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="w-full flex flex-col items-center gap-3 text-muted-foreground hover:text-blue-600 transition-colors duration-200"
                >
                  <Plus className="h-8 w-8" />
                  <span className="text-sm font-medium">Add New Vehicle</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <CompleteOrder
          onComplete={handleSubmit}
          description="You can now proceed to finalize your setup."
        />
      </div>
    </div>
  );
}
