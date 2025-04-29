'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrgStore } from '@/app/stores/useOrgStore';
import { useDemoStore } from '@/app/stores/useDemoStore';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { CompleteOrder } from '@/app/components/CompleteOrder';
import Image from 'next/image';
import {
  InfoIcon,
  CheckCircle,
  Upload,
  Building,
  PaintBucket,
  AlertCircle,
  PieChart,
  CheckSquare
} from 'lucide-react';

const colorThemes = [
  'Default',
  'Blue',
  'Green',
  'Purple',
  'Orange',
  'Dark',
];

export default function OrganizationCustomization() {
  const router = useRouter();
  const [showAnalyticsInfo, setShowAnalyticsInfo] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    orgName,
    orgLogo,
    colorTheme,
    shareDataAnalytics,
    setOrgName,
    setOrgLogo,
    setColorTheme,
    setShareDataAnalytics
  } = useOrgStore();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!orgName.trim()) {
      newErrors.orgName = 'Organization name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { isDemoMode } = useDemoAuth();
  const { setOrgData } = useDemoStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isDemoMode()) {
      // Store org data in demo store
      setOrgData({
        orgName,
        orgLogo,
        colorTheme,
        shareDataAnalytics
      });
    }

    router.push('/onboarding/users');
  };

  // Add demo mode indicator in title
  useEffect(() => {
    if (isDemoMode() && !orgName) {
      setOrgName('Demo Organization');
    }
  }, [isDemoMode, orgName, setOrgName]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const logoUrl = URL.createObjectURL(file);
      setOrgLogo(logoUrl);
    }
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
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/50 to-white/70 dark:from-black/90 dark:via-black/50 dark:to-black/70 opacity-80" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-600/5 via-cyan-300/3 to-transparent dark:from-blue-600/10 dark:via-cyan-300/5 dark:to-transparent opacity-30" />
        </div>

        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
          <h2 className="text-2xl font-bold">
            {isDemoMode() ? "Demo Mode: Organization Settings" : "Organization Settings"}
          </h2>
          <p className="mt-1 opacity-90">Customize your organization profile and preferences</p>
          {isDemoMode() && (
            <div className="mt-2 px-3 py-1.5 bg-blue-500/20 rounded-lg inline-block">
              <span className="text-sm font-medium">Demo Mode Active - All settings available for testing</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Organization Info Card */}
            <div className="relative backdrop-blur-xl bg-white/90 dark:bg-black/50 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl">
              {/* Inner glass highlights */}

              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center gap-2">
                <Building className="text-white" />
                <h2 className="text-xl font-semibold text-white">Organization Information</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                  <div className="sm:col-span-2">
                    <label htmlFor="orgName" className="flex items-center text-sm font-medium text-foreground">
                      <Building className="h-4 w-4 text-muted-foreground mr-2" />
                      Organization Name <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        id="orgName"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className={`block w-full pr-10 bg-background ${errors.orgName ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' : 'border-border focus:ring-blue-500 focus:border-blue-500'} rounded-md transition-all duration-200 hover:border-blue-200`}
                        placeholder="Enter your organization name"
                        required
                      />
                      {errors.orgName && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.orgName && <p className="mt-2 text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" /> {errors.orgName}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="orgLogo" className="flex items-center text-sm font-medium text-foreground">
                      <Upload className="h-4 w-4 text-muted-foreground mr-2" />
                      Organization Logo
                    </label>
                    <div className="mt-1 flex items-center space-x-5">
                      <div className="w-20 h-20 rounded-lg bg-accent flex items-center justify-center overflow-hidden border-2 border-border hover:border-blue-300 transition-all duration-200">
                        {orgLogo ? (
                          <div className="relative h-full w-full">
                            <Image
                              src={orgLogo}
                              alt="Organization logo"
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-blue-100/10 dark:bg-blue-900/10 rounded-md py-2 px-3 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 hover:bg-blue-100/20 dark:hover:bg-blue-900/20 transition-all duration-200 focus-within:outline-none"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 2MB</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="colorTheme" className="flex items-center text-sm font-medium text-foreground">
                      <PaintBucket className="h-4 w-4 text-muted-foreground mr-2" />
                      Color Theme
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <select
                        id="colorTheme"
                        value={colorTheme}
                        onChange={(e) => setColorTheme(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-foreground bg-background border-border focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md transition-all duration-200 hover:border-blue-200"
                      >
                        {colorThemes.map((theme) => (
                          <option key={theme} value={theme}>{theme}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">

                      </div>
                    </div>
                  </div>

                  <div className="flex items-center h-full">

                  </div>
                </div>
              </div>
            </div>

            {/* Data Sharing Card */}
            <div className="relative backdrop-blur-xl bg-white/90 dark:bg-black/50 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl">
              {/* Inner glass highlights */}


              <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <PieChart className="text-white" />
                  <h2 className="text-xl font-semibold text-white">Community Contribution</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAnalyticsInfo(!showAnalyticsInfo)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-full text-white bg-cyan-500 hover:bg-cyan-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400"
                >
                  <InfoIcon className="w-4 h-4 mr-1" />
                  {showAnalyticsInfo ? 'Hide Details' : 'Learn More'}
                </button>
              </div>

              <div className="p-6">
                {showAnalyticsInfo && (
                  <div className="mb-6 p-5 bg-cyan-100/10 dark:bg-cyan-900/10 rounded-xl border border-cyan-200/50 dark:border-cyan-800/50 transform transition-all duration-200 hover:border-cyan-300/50 dark:hover:border-cyan-700/50">
                    <h3 className="text-lg font-medium text-cyan-800 dark:text-cyan-200 mb-2 flex items-center">
                      <InfoIcon className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mr-2" />
                      How Your Data Helps
                    </h3>
                    <p className="text-sm text-cyan-700 dark:text-cyan-300 mb-3">
                      By sharing anonymized location data, you contribute to a collective effort that helps:
                    </p>
                    <ul className="text-sm text-cyan-700 dark:text-cyan-300 space-y-3 mb-3">
                      <li className="flex items-start bg-cyan-100/10 dark:bg-cyan-900/10 p-2 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-cyan-500 dark:text-cyan-400 mr-2 flex-shrink-0" />
                        <span>City planners improve road infrastructure and traffic management</span>
                      </li>
                      <li className="flex items-start bg-cyan-100/10 dark:bg-cyan-900/10 p-2 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-cyan-500 dark:text-cyan-400 mr-2 flex-shrink-0" />
                        <span>Public transportation agencies optimize routes and schedules</span>
                      </li>
                      <li className="flex items-start bg-cyan-100/10 dark:bg-cyan-900/10 p-2 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-cyan-500 dark:text-cyan-400 mr-2 flex-shrink-0" />
                        <span>Environmental agencies develop sustainable urban planning</span>
                      </li>
                    </ul>
                    <p className="text-sm text-cyan-700 dark:text-cyan-300 font-medium p-2 border-l-4 border-cyan-400 bg-cyan-100/10 dark:bg-cyan-900/10 rounded-r-lg">
                      All company information is anonymized. Only geographic and temporal data patterns are shared.
                    </p>
                  </div>
                )}

                <div className="flex items-start p-4 border border-cyan-200/50 dark:border-cyan-800/50 rounded-xl bg-cyan-100/10 dark:bg-cyan-900/10 hover:bg-cyan-100/20 dark:hover:bg-cyan-900/20 transition-all duration-200">
                  <div className="flex h-6 items-center">
                    <input
                      id="shareDataAnalytics"
                      type="checkbox"
                      checked={shareDataAnalytics}
                      onChange={(e) => setShareDataAnalytics(e.target.checked)}
                      className="h-5 w-5 text-cyan-600 border-border rounded focus:ring-cyan-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="shareDataAnalytics" className="font-medium text-foreground flex items-center">
                      <CheckSquare className="h-4 w-4 text-cyan-600 dark:text-cyan-400 mr-2" />
                      Share anonymized location data
                    </label>
                    <p className="text-muted-foreground mt-1">
                      Help cities and governments improve infrastructure and receive a <span className="font-semibold text-cyan-600 dark:text-cyan-400">10% discount</span> on your subscription
                    </p>
                  </div>
                </div>

                {shareDataAnalytics && (
                  <div className="mt-4 flex items-center p-4 bg-green-100/10 dark:bg-green-900/10 rounded-xl border border-green-200/50 dark:border-green-800/50 transform transition-all duration-300 hover:border-green-300/50 dark:hover:border-green-700/50">
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                    <span className="text-sm text-green-800 dark:text-green-200 font-medium">
                      Your 10% discount will be automatically applied! Thank you for contributing to smarter cities.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <CompleteOrder
          onComplete={handleSubmit}
          description="You can now proceed to configure users."
        />
      </div>
    </div>
  );
}
