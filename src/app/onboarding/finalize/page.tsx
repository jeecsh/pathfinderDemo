'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useBillingStore } from '@/app/stores/useBillingStore';
import { useOrgStore } from '@/app/stores/useOrgStore';
import { useUserStore } from '@/app/stores/useUserStore';
import { useVehicleStore } from '@/app/stores/useVehicleStore';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { useDemoStore } from '@/app/stores/useDemoStore';
import { CompleteOrder, getHardwareOptions } from '@/app/components/CompleteOrder';

export default function FinalizePage() {
  const router = useRouter();
  const { isDemoMode } = useDemoAuth();
  const demoStore = useDemoStore();

  // Load tempToken on mount
  useEffect(() => {
    try {
      localStorage.getItem('tempToken');
    } catch (err) {
      console.error('Error reading tempToken:', err);
    }
  }, []);

  // Get states from all stores
  const {
    trackingType,
    countingType,
    mobileAppEnabled,
    announcementEnabled,
    notificationEnabled,
    feedbackEnabled,
    hardwareQuantity,
    selectedHardware
  } = useBillingStore();

  const {
    orgName,
    orgLogo,
    colorTheme,
    dataAnalyticsEnabled,
    shareDataAnalytics
  } = useOrgStore();

  const { teamMembers, getTeamMembersByRole } = useUserStore();
  const { vehicles } = useVehicleStore();

  // Get different user types
  getTeamMembersByRole(['admin', 'manager', 'viewer']);
  const drivers = getTeamMembersByRole(['driver']);
  const mobileUsers = getTeamMembersByRole(['mobile']);

  // Validation
  const canAddDrivers = trackingType === 'software' || (trackingType === 'hardware' && mobileAppEnabled);

  const handleSubmit = async () => {
    try {
      if (isDemoMode()) {
        // Convert blob URL to base64 if it exists
        let logoBase64 = '';
        if (orgLogo && orgLogo.startsWith('blob:')) {
          const response = await fetch(orgLogo);
          const blob = await response.blob();
          logoBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        }

        // Store all data in demo store
        demoStore.setBillingData({
          trackingType,
          countingType,
          mobileAppEnabled,
          announcementEnabled,
          notificationEnabled,
          feedbackEnabled,
          hardwareQuantity,
          selectedHardware
        });

        demoStore.setOrgData({
          orgName,
          orgLogo: logoBase64 || '',
          colorTheme,
          shareDataAnalytics
        });

        // Store users
        teamMembers.forEach(member => {
          demoStore.addUser({
            email: member.email,
            role: member.role,
            name: member.name,
            phone: member.phone
          });
        });

        // Store vehicles
        vehicles.forEach(vehicle => {
          demoStore.addVehicle({
            name: vehicle.name,
            type: vehicle.type,
            licensePlate: vehicle.licensePlate,
            model: vehicle.model,
            year: vehicle.year,
            vin: vehicle.vin,
            trackingDevice: vehicle.trackingDevice || {
              type: 'GPS',
              serialNumber: 'DEMO-' + Math.random().toString(36).substr(2, 9)
            }
          });
        });

        router.push('/dashboard');
        return;
      }

      // For non-demo mode, just store the blob URL directly
      const logoUrl = orgLogo || '';

      // Prepare subscription data with hardware devices
      const subscriptionData = {
        tracking_type: trackingType,
        counting_type: countingType,
        mobile_app_enabled: mobileAppEnabled,
        announcement_enabled: announcementEnabled,
        notification_enabled: notificationEnabled,
        feedback_enabled: feedbackEnabled,
        counting_enabled: Boolean(countingType),
        hardware_devices: selectedHardware ? [{
          type: selectedHardware,
          quantity: hardwareQuantity,
          model: getHardwareOptions(countingType)
            .find(h => h.id === selectedHardware)?.name || '',
        }] : []
      };

      // Get customization data
      const customizationData = {
        org_name: orgName,
        org_logo: logoUrl || undefined,
        color_theme: colorTheme,
        data_analytics_enabled: dataAnalyticsEnabled,
        share_data_analytics: shareDataAnalytics
      };

      // Transform team members data
      const usersData = teamMembers.map(member => ({
        email: member.email,
        role: member.role,
        is_active: true
      }));

      // Transform vehicles data
      const vehiclesData = vehicles.map(vehicle => ({
        name: vehicle.name,
        type: vehicle.type,
        plate_number: vehicle.licensePlate,
        driver_email: vehicle.vin // Using VIN as driver email for now
      }));

      // Store data locally for non-demo mode as well
      localStorage.setItem('orgData', JSON.stringify({
        customization: customizationData,
        subscription: subscriptionData,
        users: usersData,
        vehicles: vehiclesData
      }));

      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing registration:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(37,99,235,0.08),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(37,99,235,0.15),rgba(0,0,0,0))]" />
        <div className="animate-pulse absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl" />
        <div className="animate-pulse absolute -bottom-20 right-1/4 w-96 h-96 bg-cyan-300/5 dark:bg-cyan-300/10 rounded-full blur-3xl" />
        <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-blue-600/10 dark:via-blue-600/20 to-transparent top-1/3" />
      </div>

      <div className="relative backdrop-blur-xl bg-white/90 dark:bg-black/50 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-blue-900/10 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-8">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E')] opacity-10 pointer-events-none" />
          <h2 className="text-3xl font-bold text-white">
            {isDemoMode() ? "Review Demo Organization" : "Review Your Organization"}
          </h2>
          <p className="mt-2 text-blue-100 text-lg">
            {isDemoMode() 
              ? "Verify your demo setup configuration" 
              : "Please verify all information before completing your setup"}
          </p>
          {isDemoMode() && (
            <div className="mt-4 px-4 py-2 bg-blue-500/20 rounded-lg inline-block">
              <span className="text-sm font-medium text-white">
                Demo Mode Active - Changes will be stored locally
              </span>
            </div>
          )}
        </div>

        {/* Organization Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Organization</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Organization Name</span>
                <span className="font-medium text-gray-900 dark:text-white">{orgName || 'Not Set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Color Theme</span>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: colorTheme || '#2563EB' }}
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {colorTheme || 'Default Blue'}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Data Analytics</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {dataAnalyticsEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              {orgLogo && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Organization Logo</span>
                  <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded overflow-hidden shadow">
                    <img src={orgLogo} alt="Organization Logo" className="w-full h-full object-contain" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Subscription</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tracking Method</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">{trackingType}</span>
              </div>
              {countingType && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Counting Type</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">{countingType}</span>
                </div>
              )}
              {selectedHardware && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Hardware</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {getHardwareOptions(countingType).find(h => h.id === selectedHardware)?.name} ({hardwareQuantity})
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Mobile App</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {mobileAppEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Announcements</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {announcementEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Notifications</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {notificationEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Feedback System</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {feedbackEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members & Vehicles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 border-t border-gray-200 dark:border-gray-800">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Team Members</h3>
            {teamMembers.length > 0 ? (
              <div className="overflow-auto max-h-60">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {teamMembers.map((member, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{member.name}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{member.email}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">{member.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No team members added yet.</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Vehicles</h3>
            {vehicles.length > 0 ? (
              <div className="overflow-auto max-h-60">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vehicle</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">License</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {vehicles.map((vehicle, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{vehicle.name}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{vehicle.licensePlate}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">{vehicle.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No vehicles added yet.</p>
            )}
          </div>
        </div>

        {/* Compatibility Warnings */}
        {!canAddDrivers && (mobileUsers.length > 0 || drivers.length > 0) && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-amber-50 dark:bg-amber-900/20">
            <div className="flex items-center gap-3 text-amber-800 dark:text-amber-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <h4 className="font-medium">Compatibility Warning</h4>
            </div>
            <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
              Your current tracking setup doesn't support mobile users or drivers. Consider enabling the mobile app or switching to software tracking.
            </p>
          </div>
        )}
      </div>

      <div className="mt-12">
        <CompleteOrder
          onComplete={handleSubmit}
          description={isDemoMode() 
            ? "Complete demo setup and go to dashboard" 
            : "Complete your setup to access the dashboard."}
        />
      </div>
    </div>
  );
}