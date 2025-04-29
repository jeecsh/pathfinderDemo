import { Receipt, Package, Tag, Zap, Percent } from "lucide-react";
import { useBillingStore } from "../stores/useBillingStore";
import { useOrgStore } from "../stores/useOrgStore";

export interface Hardware {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  softwareOnly?: boolean;
}

export interface CompleteOrderProps {
  discount?: number;
  onComplete?: (e: React.FormEvent) => void;
  description?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const getBasePrice = (trackingType: string) => {
  if (!trackingType) return 0;
  return trackingType === "software" ? 49.99 : 79.99;
};

export const getCountingPrice = (countingType: string) => {
  if (!countingType) return 0;
  const prices = {
    "qr_code": 9.99,
    "AI Camera": 29.99,
    "Sensors": 39.99,
    "AirTags": 24.99,
    "Attendance": 19.99,
    "NFC": 14.99
  };
  return prices[countingType as keyof typeof prices] || 0;
};

export const getHardwareOptions = (countingType: string): Hardware[] => {
  if (!countingType) return [];

  const options: Record<string, Hardware[]> = {
    "qr_code": [
      {
        id: "qr-driver",
        name: "QR Code Driver",
        description: "Software driver for scanning QR codes from existing devices",
        price: 0,
        icon: "QrCode",
        softwareOnly: true
      },
      {
        id: "qr-screen",
        name: "QR Screen Device",
        description: "Dedicated screen device for displaying and scanning QR codes",
        price: 89.99,
        icon: "Monitor"
      }
    ],
    "AI Camera": [
      {
        id: "ai-camera-basic",
        name: "Basic AI Camera Kit",
        description: "Microcontroller + basic camera module for simple image processing",
        price: 149.99,
        icon: "Camera"
      },
      {
        id: "ai-camera-mid",
        name: "Mid AI Camera Kit",
        description: "Camera with GPU accelerator for medium performance AI processing",
        price: 249.99,
        icon: "Camera"
      },
      {
        id: "ai-camera-pro",
        name: "Pro AI Camera Kit",
        description: "High-end camera with dedicated AI processor and advanced features",
        price: 349.99,
        icon: "Camera"
      }
    ],
    "Sensors": [
      {
        id: "rfid-sensor",
        name: "RFID Sensor Kit",
        description: "RFID reader with tags for identification and tracking",
        price: 129.99,
        icon: "Radio"
      },
      {
        id: "motion-sensor",
        name: "Motion Sensor Kit",
        description: "Motion detection sensors for presence tracking",
        price: 99.99,
        icon: "Radio"
      },
      {
        id: "combo-sensor",
        name: "Combo Sensor Pack",
        description: "Combination of RFID and motion sensors for comprehensive tracking",
        price: 199.99,
        icon: "Radio"
      }
    ],
    "AirTags": [
      {
        id: "airtag-kit",
        name: "AirTag Safety Kit",
        description: "5 child safety tags + reader for bus tracking (beacon technology)",
        price: 129.99,
        icon: "Tag"
      },
      {
        id: "airtag-pro",
        name: "AirTag Pro Kit",
        description: "10 tags with extended range and additional features",
        price: 199.99,
        icon: "Tag"
      }
    ],
    "NFC": [
      {
        id: "nfc-basic",
        name: "Basic NFC Kit",
        description: "NFC reader with 10 tags for phone interactions",
        price: 79.99,
        icon: "Wifi"
      },
      {
        id: "nfc-advanced",
        name: "Advanced NFC Kit",
        description: "Multiple readers with 50 tags and management software",
        price: 149.99,
        icon: "Wifi"
      }
    ],
    "Attendance": [
      {
        id: "card-attendance",
        name: "Card Attendance System",
        description: "Card readers with 50 ID cards for attendance tracking",
        price: 149.99,
        icon: "CreditCard"
      },
      {
        id: "biometric-attendance",
        name: "Biometric System",
        description: "Fingerprint readers for secure attendance tracking",
        price: 249.99,
        icon: "CreditCard"
      }
    ]
  };

  return options[countingType] || [];
};

export const CompleteOrder: React.FC<CompleteOrderProps> = ({ onComplete, description, disabled, children }) => {
  const {
    trackingType,
    countingType,
    mobileAppEnabled,
    announcementEnabled,
    notificationEnabled,
    hardwareQuantity,
    selectedHardware
  } = useBillingStore();

  const { shareDataAnalytics } = useOrgStore();

  const getAddonPrice = () => {
    let total = 0;
    if (mobileAppEnabled) total += 9.99;
    if (announcementEnabled) total += 4.99;
    if (notificationEnabled) total += 4.99;
    return total;
  };

  const getHardwareCost = () => {
    if (!selectedHardware) return 0;
    const hardware = getHardwareOptions(countingType).find(h => h.id === selectedHardware);
    return hardware ? hardware.price * hardwareQuantity : 0;
  };

  const subtotalPrice = getBasePrice(trackingType) + getCountingPrice(countingType) + getAddonPrice();
  const communityDiscount = shareDataAnalytics ? 10 : 0;
  const discountAmount = (subtotalPrice * communityDiscount) / 100;
  const subscriptionPrice = subtotalPrice - discountAmount;
  const oneTimeHardwareCost = getHardwareCost();

  return (
    <div className="w-full space-y-8 relative backdrop-blur-xl bg-white/90 dark:bg-black/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-blue-900/10 animate-fadeIn">
      {/* Inner glass highlights */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/50 to-white/70 dark:from-black/90 dark:via-black/50 dark:to-black/70 opacity-80" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-600/5 via-cyan-300/3 to-transparent dark:from-blue-600/10 dark:via-cyan-300/5 dark:to-transparent opacity-30" />
        <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-bl from-blue-600/5 to-cyan-300/5 dark:from-blue-600/10 dark:to-cyan-300/10 blur-xl opacity-50 transform translate-x-20 -translate-y-16" />
      </div>

      <div className="relative">
        <div className="flex items-center space-x-2 mb-4">
          <Receipt className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Complete Your Order</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="backdrop-blur-sm bg-white/50 dark:bg-black/30 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
              <Zap className="mr-2 text-blue-600" size={18} />
              Monthly Subscription
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span className="font-medium">Base Plan ({trackingType || "Not selected"})</span>
                <span className="font-semibold">${getBasePrice(trackingType).toFixed(2)}</span>
              </div>

              {countingType && (
                <div className="flex justify-between text-gray-700 dark:text-gray-300 py-1">
                  <span>Counting Technology ({countingType})</span>
                  <span className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-300 bg-clip-text text-transparent">+${getCountingPrice(countingType).toFixed(2)}</span>
                </div>
              )}

              {mobileAppEnabled && (
                <div className="flex justify-between text-gray-700 dark:text-gray-300 py-1">
                  <span>Mobile App</span>
                  <span className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-300 bg-clip-text text-transparent">+$9.99</span>
                </div>
              )}

              {announcementEnabled && (
                <div className="flex justify-between text-gray-700 dark:text-gray-300 py-1">
                  <span>Announcements</span>
                  <span className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-300 bg-clip-text text-transparent">+$4.99</span>
                </div>
              )}

              {notificationEnabled && (
                <div className="flex justify-between text-gray-700 dark:text-gray-300 py-1">
                  <span>Notifications</span>
                  <span className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-300 bg-clip-text text-transparent">+$4.99</span>
                </div>
              )}

              {communityDiscount > 0 && (
                <div className="flex justify-between py-2 px-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-900/30 border border-green-100 dark:border-green-900/50">
                  <span className="flex items-center text-green-700 dark:text-green-400">
                    <Percent className="mr-2 h-4 w-4" />
                    Community Contribution Discount ({communityDiscount}%)
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 mt-1 border-t border-gray-200 dark:border-gray-800">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Monthly Total</span>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-300 bg-clip-text text-transparent">${subscriptionPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {oneTimeHardwareCost > 0 && (
            <div className="backdrop-blur-sm bg-white/50 dark:bg-black/30 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <Package className="mr-2 text-blue-600" size={18} />
                One-Time Hardware
              </h3>
              <div className="space-y-2 text-sm">
                {getHardwareOptions(countingType)
                  .filter(h => h.id === selectedHardware)
                  .map(hardware => (
                    <div key={hardware.id} className="flex justify-between text-gray-700 dark:text-gray-300 py-1">
                      <span className="flex items-center">
                        <Tag className="mr-2 h-4 w-4 text-blue-600 dark:text-cyan-300" />
                        {hardware.name} × {hardwareQuantity}
                      </span>
                      <span className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-300 bg-clip-text text-transparent">
                        ${(hardware.price * hardwareQuantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                <div className="flex justify-between pt-2 mt-1 border-t border-gray-200 dark:border-gray-800">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Hardware Total</span>
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-300 bg-clip-text text-transparent">
                    ${oneTimeHardwareCost.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

          {onComplete && description && (
            <div className="mt-6 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-300 rounded-lg blur opacity-30"></div>
              <div className="relative backdrop-blur-xl bg-white/90 dark:bg-black/50 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-center sm:text-left space-y-2">
                    <div className="text-sm text-blue-600 dark:text-cyan-300">{description}</div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-300 bg-clip-text text-transparent">
                      ${(subscriptionPrice + oneTimeHardwareCost).toFixed(2)}
                      {oneTimeHardwareCost > 0 && (
                        <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                          (${subscriptionPrice.toFixed(2)}/mo + ${oneTimeHardwareCost.toFixed(2)} hardware)
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onComplete}
                    className="group relative flex justify-center items-center rounded-lg border border-transparent bg-blue-600 hover:from-blue-700 hover:to-cyan-400 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 dark:shadow-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-cyan-300 focus:ring-offset-2 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={disabled}
                  >
                    <div className="flex items-center">
                      {children}
                      Continue
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
