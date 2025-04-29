'use client';

import { useRouter } from 'next/navigation';
import { useBillingStore } from '@/app/stores/useBillingStore';
import { useOrgStore } from '@/app/stores/useOrgStore';
import { useUserStore } from '@/app/stores/useUserStore';
import { useVehicleStore } from '@/app/stores/useVehicleStore';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { useDemoStore } from '@/app/stores/useDemoStore';
import { CompleteOrder, getHardwareOptions } from '@/app/components/CompleteOrder';
import { Building2, Users, Car, Package, AlertCircle, Check } from 'lucide-react';

export default function FinalizePage() {
  const router = useRouter();
  const { isDemoMode } = useDemoAuth();
  const demoStore = useDemoStore();

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
  const teamUsers = getTeamMembersByRole(['admin', 'manager', 'viewer']);
  const drivers = getTeamMembersByRole(['driver']);
  const mobileUsers = getTeamMembersByRole(['mobile']);

  // Validation
  const canAddDrivers = trackingType === 'software' || (trackingType === 'hardware' && mobileAppEnabled);
  const hasInvalidDrivers = !canAddDrivers && drivers.length > 0;
  const hasInvalidMobileUsers = !canAddDrivers && mobileUsers.length > 0;

  const handleSubmit = async () => {
    try {
      if (isDemoMode()) {
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
          orgLogo: orgLogo || '',
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

      // Regular mode
      let logoUrl = orgLogo;
      if (orgLogo && orgLogo.startsWith('blob:')) {
        // Convert blob URL to File object
        const response = await fetch(orgLogo);
        const blob = await response.blob();
        const file = new File([blob], 'logo.png', { type: 'image/png' });

        // Upload to storage
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/logo/upload', {
          method: 'POST',
          body: formData
        });

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          throw new Error(error.message || 'Failed to upload logo');
        }

        const { url } = await uploadResponse.json();
        logoUrl = url;
      }

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

      // Get the temporary token from localStorage
      const tempToken = localStorage.getItem('tempToken');
      if (!tempToken) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/registration/complete-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify({
          customization: customizationData,
          subscription: subscriptionData,
          users: usersData,
          vehicles: vehiclesData
        })
      });

      if (!response.ok) {
        throw new Error('Registration completion failed');
      }

      const result = await response.json();

      // Store the final token and clear temporary token
      localStorage.setItem('token', result.token);
      localStorage.removeItem('tempToken');

      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing registration:', error);
    }
  };

  // Rest of the JSX remains the same
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

        {/* Content sections remain the same */}
        {/* ... */}

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
