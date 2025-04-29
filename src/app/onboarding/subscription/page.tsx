"use client";
import React from "react";
import { AlertCircle, Check, Smartphone, QrCode, Camera, Radio, Tag, Clock, Wifi, Monitor, AlertTriangle } from "lucide-react";
import { useBillingStore } from "@/app/stores/useBillingStore";
import { CompleteOrder, getHardwareOptions } from "@/app/components/CompleteOrder";
import type { Hardware } from "@/app/components/CompleteOrder";
import { useRouter } from 'next/navigation';
import { useDemoAuth } from "@/hooks/useDemoAuth";
import { useDemoStore } from "@/app/stores/useDemoStore";

interface HybridWarningModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const HybridWarningModal: React.FC<HybridWarningModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 max-w-md mx-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="text-amber-500 mr-2" size={24} />
          <h3 className="text-lg font-semibold text-foreground">Hybrid Approach Warning</h3>
        </div>
        <p className="text-muted-foreground mb-6">
          You&apos;ve selected to enable hybrid mode, which will allow you to use advanced counting technologies with the software solution. This may require additional setup and configuration.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Enable Hybrid Mode
          </button>
        </div>
      </div>
    </div>
  );
};

const BillingPage = () => {
  const router = useRouter();
  const { isDemoMode } = useDemoAuth();
  const { setBillingData } = useDemoStore();

  const {
    trackingType,
    countingType,
    mobileAppEnabled,
    announcementEnabled,
    notificationEnabled,
    feedbackEnabled,
    hardwareQuantity,
    selectedHardware,
    hybridAcknowledged,
    setTrackingType,
    setCountingType,
    setCountingEnabled,
    setMobileAppEnabled,
    setAnnouncementEnabled,
    setNotificationEnabled,
    setFeedbackEnabled,
    setHardwareQuantity,
    setSelectedHardware,
    setHybridAcknowledged
  } = useBillingStore();

  // State for warning modal
  const [showHybridWarning, setShowHybridWarning] = React.useState(false);

  const handleTrackingSelection = (type: string) => {
    setTrackingType(type);
    // Reset all settings when changing tracking type
    setCountingType('');
    setCountingEnabled(false);
    setNotificationEnabled(false);
    setAnnouncementEnabled(false);
    setHardwareQuantity(1);
    setSelectedHardware(null);
    // Enable mobile app for software solution
    if (type === 'software') {
      setMobileAppEnabled(true);
    }
  };

  const handleCountingSelection = (type: string) => {
    setCountingType(type);
    if (type) {
      setCountingEnabled(true);
    }
  };

  const handleHybridConfirm = () => {
    setHybridAcknowledged(true);
    setShowHybridWarning(false);
  };

  const handleHybridCancel = () => {
    setShowHybridWarning(false);
  };

  const handleHardwareSelection = (hardware: string | null) => {
    setSelectedHardware(hardware);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isDemoMode()) {
      setBillingData({
        trackingType,
        countingType,
        mobileAppEnabled,
        announcementEnabled,
        notificationEnabled,
        feedbackEnabled,
        hardwareQuantity,
        selectedHardware
      });
    }
    
    router.push('/onboarding/settings');
  };

  // Show hardware section if hardware tracking selected OR if software tracking with non-software-only options
  const showHardwareSection = () => {
    if (!countingType) return false;

    if (trackingType === "hardware") return true;

    if (trackingType === "software") {
      const options = getHardwareOptions(countingType);
      return options.some(opt => !opt.softwareOnly);
    }

    return false;
  };

  const isOptionDisabled = (countingOption: string) => {
    return trackingType === 'software' && countingOption !== 'qr_code' && !hybridAcknowledged;
  };

  // ... (rest of the component JSX remains the same)
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

        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
          <h1 className="text-2xl font-bold">
            {isDemoMode() ? "Demo Mode: Select Your Tracking Solution" : "Select Your Tracking Solution"}
          </h1>
          <p className="mt-1 opacity-90">Choose the options that best fit your organization&apos;s needs</p>
          {isDemoMode() && (
            <div className="mt-2 px-3 py-1.5 bg-blue-500/20 rounded-lg inline-block">
              <span className="text-sm font-medium">Demo Mode Active - All features available for testing</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Software Solution Card */}
            <div
              className={`backdrop-blur-xl bg-white/90 dark:bg-black/50 rounded-xl border border-gray-200 dark:border-gray-800 p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                trackingType === "software"
                  ? "ring-2 ring-blue-500 bg-blue-100/10 dark:bg-blue-950/50 shadow-blue-500/10"
                  : "hover:bg-accent/50"
              }`}
              onClick={() => handleTrackingSelection("software")}
            >
              <div className="relative">
                {/* Card inner highlights */}

                <div className="relative flex items-center mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md mr-3">
                    <Smartphone size={24} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Software Solution</h3>
                  {trackingType === "software" && <Check size={20} className="ml-auto text-green-600" />}
                </div>

                <p className="text-muted-foreground mb-4">Mobile app-based tracking with optional counting technologies to enhance your experience.</p>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="font-medium text-foreground">$49.99/month</span>
                  <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                    <Smartphone size={16} className="mr-1" />
                    <span>Includes mobile app</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hardware Solution Card */}
            <div
              className={`backdrop-blur-xl bg-white/90 dark:bg-black/50 rounded-xl border border-gray-200 dark:border-gray-800 p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                trackingType === "hardware"
                  ? "ring-2 ring-blue-500 bg-blue-100/10 dark:bg-blue-950/50 shadow-blue-500/10"
                  : "hover:bg-accent/50"
              }`}
              onClick={() => handleTrackingSelection("hardware")}
            >
              <div className="relative">
                {/* Card inner highlights */}

                <div className="flex items-center mb-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-md mr-3">
                    <Radio size={24} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Hardware Solution</h3>
                  {trackingType === "hardware" && <Check size={20} className="ml-auto text-green-600" />}
                </div>

                <p className="text-muted-foreground mb-4">Physical hardware-based tracking with optional counting technologies for more advanced solutions.</p>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="font-medium text-foreground">$79.99/month</span>
                  <div className="flex items-center text-sm text-orange-600 dark:text-orange-400">
                    <AlertCircle size={16} className="mr-1" />
                    <span>Mobile app optional</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        
          {/* Counting Technology Selection */}
          {trackingType && (
            <div className="mt-6 border border-border rounded-lg p-4">
               <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-foreground">Optional Counting Technology</h3>
                <span className="text-sm text-muted-foreground">Choose one or none</span>
              </div>

              {trackingType === "software" && (
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={() => {
                      if (!hybridAcknowledged) {
                        setShowHybridWarning(true);
                      } else {
                        setHybridAcknowledged(false);
                        setCountingType('');
                      }
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                      hybridAcknowledged
                        ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-950'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {hybridAcknowledged ? (
                      <>
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Hybrid Mode Enabled - Click to Disable
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Enable Hybrid Mode
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <HybridWarningModal
                  isOpen={showHybridWarning}
                  onConfirm={handleHybridConfirm}
                  onCancel={handleHybridCancel}
                />

                <div
                  className={`border border-border rounded-lg p-3 flex flex-col items-center cursor-pointer ${
                    countingType === "qr_code"
                      ? "bg-blue-100/10 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => handleCountingSelection("qr_code")}
                >
                  <QrCode size={28} className="text-blue-600 dark:text-blue-400 mb-2" />
                  <span className="font-medium text-sm text-center text-foreground">QR Code</span>
                  <span className="text-xs text-muted-foreground mt-1">+$9.99/mo</span>
                </div>

                <div
                  className={`border border-border rounded-lg p-3 flex flex-col items-center ${
                    countingType === "AI Camera"
                      ? "bg-green-100/10 dark:bg-green-950/50 border-green-200 dark:border-green-800"
                      : isOptionDisabled("AI Camera")
                        ? "opacity-50 pointer-events-none bg-accent"
                        : "hover:bg-accent cursor-pointer"
                  }`}
                  onClick={() => !isOptionDisabled("AI Camera") && handleCountingSelection("AI Camera")}
                >
                  <Camera size={28} className="text-green-600 dark:text-green-400 mb-2" />
                  <span className="font-medium text-sm text-center text-foreground">AI Camera</span>
                  <span className="text-xs text-muted-foreground mt-1">+$29.99/mo</span>
                </div>

      {/* Continue with similar updates for other counting options... */}
<div
  className={`border border-border rounded-lg p-3 flex flex-col items-center ${
    countingType === "Sensors"
      ? "bg-purple-100/10 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800"
      : isOptionDisabled("Sensors")
        ? "opacity-50 pointer-events-none bg-accent"
        : "hover:bg-accent cursor-pointer"
  }`}
  onClick={() => !isOptionDisabled("Sensors") && handleCountingSelection("Sensors")}
>
  <Radio size={28} className="text-purple-600 dark:text-purple-400 mb-2" />
  <span className="font-medium text-sm text-center text-foreground">Sensors</span>
  <span className="text-xs text-muted-foreground mt-1">+$39.99/mo</span>
</div>

<div
  className={`border border-border rounded-lg p-3 flex flex-col items-center ${
    countingType === "AirTags"
      ? "bg-blue-100/10 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800"
      : isOptionDisabled("AirTags")
        ? "opacity-50 pointer-events-none bg-accent"
        : "hover:bg-accent cursor-pointer"
  }`}
  onClick={() => !isOptionDisabled("AirTags") && handleCountingSelection("AirTags")}
>
  <Tag size={28} className="text-blue-600 dark:text-blue-400 mb-2" />
  <span className="font-medium text-sm text-center text-foreground">AirTags</span>
  <span className="text-xs text-muted-foreground mt-1">+$24.99/mo</span>
</div>

<div
  className={`border border-border rounded-lg p-3 flex flex-col items-center ${
    countingType === "NFC"
      ? "bg-indigo-100/10 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800"
      : isOptionDisabled("NFC")
        ? "opacity-50 pointer-events-none bg-accent"
        : "hover:bg-accent cursor-pointer"
  }`}
  onClick={() => !isOptionDisabled("NFC") && handleCountingSelection("NFC")}
>
  <Wifi size={28} className="text-indigo-600 dark:text-indigo-400 mb-2" />
  <span className="font-medium text-sm text-center text-foreground">NFC</span>
  <span className="text-xs text-muted-foreground mt-1">+$14.99/mo</span>
</div>

<div
  className={`border border-border rounded-lg p-3 flex flex-col items-center ${
    countingType === "Attendance"
      ? "bg-amber-100/10 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800"
      : isOptionDisabled("Attendance")
        ? "opacity-50 pointer-events-none bg-accent"
        : "hover:bg-accent cursor-pointer"
  }`}
  onClick={() => !isOptionDisabled("Attendance") && handleCountingSelection("Attendance")}
>
  <Clock size={28} className="text-amber-600 dark:text-amber-400 mb-2" />
  <span className="font-medium text-sm text-center text-foreground">Attendance</span>
  <span className="text-xs text-muted-foreground mt-1">+$19.99/mo</span>
</div>

              </div>

              {countingType && (
                <div className="mt-3 flex justify-end">
                  <button
                    className="text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setCountingType("");
                      setCountingEnabled(false);
                    }}
                  >
                    Reset selection
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hardware Selection Section */}
          {showHardwareSection() && (
            <div className="mt-6 border border-border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-foreground">
                  {trackingType === "software" ? "Optional " : "Required "}
                  Hardware
                </h3>
                <span className="text-sm text-muted-foreground">
                  {trackingType === "software" ? "Optional purchase" : "One-time purchase"}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {trackingType === "software"
                  ? `Optional hardware equipment available for your ${countingType} system.`
                  : `Select the hardware equipment needed for your ${countingType} system.`}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {getHardwareOptions(countingType).map((hardware: Hardware) => {
                  if (trackingType === "software" && hardware.softwareOnly === false) return null;

                  const IconComponent = hardware.icon === "QrCode" ? QrCode :
                                      hardware.icon === "Monitor" ? Monitor :
                                      hardware.icon === "Camera" ? Camera :
                                      hardware.icon === "Radio" ? Radio :
                                      hardware.icon === "Tag" ? Tag :
                                      hardware.icon === "Wifi" ? Wifi :
                                      Camera; // Default to Camera if icon not found

                  return (
                    <div
                      key={hardware.id}
                      className={`border border-border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedHardware === hardware.id
                          ? "ring-2 ring-blue-500 bg-blue-100/10 dark:bg-blue-950/50"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => handleHardwareSelection(hardware.id)}
                    >
                      <div className="flex items-center mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md mr-3">
                          <IconComponent size={24} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{hardware.name}</h4>
                          <span className="text-sm text-blue-600 dark:text-blue-400">
                            {hardware.price > 0 ? `$${hardware.price.toFixed(2)} per unit` : "Included with software"}
                          </span>
                        </div>
                        {selectedHardware === hardware.id && (
                          <Check size={20} className="ml-auto text-green-600" />
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mt-2 mb-3">{hardware.description}</p>

                      {selectedHardware === hardware.id && hardware.price > 0 && (
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                          <div className="flex items-center">
                            <button
                              className="w-8 h-8 flex items-center justify-center bg-accent rounded-l-md"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (hardwareQuantity > 1) setHardwareQuantity(hardwareQuantity - 1);
                              }}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={hardwareQuantity}
                              onChange={(e) => {
                                e.stopPropagation();
                                const val = parseInt(e.target.value);
                                if (!isNaN(val) && val >= 1) setHardwareQuantity(val);
                              }}
                              className="w-12 h-8 text-center border-y border-border bg-background text-foreground"
                            />
                            <button
                              className="w-8 h-8 flex items-center justify-center bg-accent rounded-r-md"
                              onClick={(e) => {
                                e.stopPropagation();
                                setHardwareQuantity(hardwareQuantity + 1);
                              }}
                            >
                              +
                            </button>
                          </div>
                          <div className="font-semibold text-foreground">
                            Total: ${(hardware.price * hardwareQuantity).toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons Section */}
          {trackingType && (
            <div className="mt-6 border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground mb-3">Additional Features</h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {trackingType === "hardware" && (
                  <div className="border border-border rounded-lg p-3">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mobileAppEnabled}
                        onChange={(e) => setMobileAppEnabled(e.target.checked)}
                        className="mt-1"
                      />
                      <div className="ml-2">
                        <span className="font-medium text-sm block text-foreground">Mobile App</span>
                        <span className="text-xs text-muted-foreground">+$9.99/mo</span>
                      </div>
                    </label>
                  </div>
                )}

                <div className="border border-border rounded-lg p-3">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={announcementEnabled}
                      onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                      className="mt-1"
                    />
                    <div className="ml-2">
                      <span className="font-medium text-sm block text-foreground">Announcements</span>
                      <span className="text-xs text-muted-foreground">+$4.99/mo</span>
                    </div>
                  </label>
                </div>

                <div className="border border-border rounded-lg p-3">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationEnabled}
                      onChange={(e) => setNotificationEnabled(e.target.checked)}
                      className="mt-1"
                    />
                    <div className="ml-2">
                      <span className="font-medium text-sm block text-foreground">Notifications</span>
                      <span className="text-xs text-muted-foreground">+$4.99/mo</span>
                    </div>
                  </label>
                </div>

                <div className="border border-border rounded-lg p-3">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={feedbackEnabled}
                      onChange={(e) => setFeedbackEnabled(e.target.checked)}
                      className="mt-1"
                    />
                    <div className="ml-2">
                      <span className="font-medium text-sm block text-foreground">Feedback System</span>
                      <span className="text-xs text-muted-foreground">+$4.99/mo</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <CompleteOrder
        onComplete={handleSubmit}
        description={isDemoMode() 
          ? "Continue to configure your demo organization" 
          : "You can now proceed to finalize your setup."}
      />
    </div>
  );
};

export default BillingPage;
