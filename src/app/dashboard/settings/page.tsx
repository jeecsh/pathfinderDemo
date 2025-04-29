'use client';

import { useState } from 'react';
import { useOrgStore } from '@/app/stores/useOrgStore';
import { ThemeHeader } from '@/components/ui/themed/ThemeHeader';
import { ThemeCard } from '@/components/ui/themed/ThemeCard';
import { ThemeButton } from '@/components/ui/themed/ThemeButton';
import { useOrgTheme } from '@/hooks/useOrgTheme';
import { Settings, Palette, Share2, Save, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRESET_COLORS = [
  '#0891b2', // Default cyan
  '#2563eb', // Blue
  '#7c3aed', // Violet
  '#db2777', // Pink
  '#059669', // Emerald
  '#d97706', // Amber
  '#dc2626', // Red
  '#4f46e5', // Indigo
];

export default function SettingsPage() {
  const { 
    orgName,
    orgLogo,
    colorTheme,
    dataAnalyticsEnabled,
    shareDataAnalytics,
    setOrgName,
    setOrgLogo,
    setColorTheme,
    setDataAnalyticsEnabled,
    setShareDataAnalytics 
  } = useOrgStore();

  const { getGradient } = useOrgTheme();
  const [tempLogo, setTempLogo] = useState<string | null>(orgLogo);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Update logo if changed
      if (tempLogo !== orgLogo) {
        setOrgLogo(tempLogo);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <ThemeHeader
        description="Configure your organization settings and preferences"
        action={
          <ThemeButton
            onClick={handleSave}
            icon={<Save className="h-4 w-4" />}
            isLoading={saving}
          >
            Save Changes
          </ThemeButton>
        }
      >
        Organization Settings
      </ThemeHeader>

      <div className="grid gap-6">
        {/* Basic Information */}
        <ThemeCard
          title="Basic Information"
          description="Update your organization's basic details"
          icon={<Settings className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Organization Name
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2"
                placeholder="Enter organization name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Organization Logo
              </label>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-20 h-20 rounded-lg border border-border overflow-hidden">
                  {tempLogo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={tempLogo}
                      alt={`${orgName} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent">
                      <Image className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload">
                    <ThemeButton
                      type="button"
                      variant="outline"
                      className="mb-2"
                      icon={<Image className="h-4 w-4" />}
                    >
                      Upload New Logo
                    </ThemeButton>
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Recommended size: 512x512px. Max size: 2MB.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ThemeCard>

        {/* Theme Settings */}
        <ThemeCard
          title="Theme Customization"
          description="Choose your organization's color theme"
          icon={<Palette className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-8 gap-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setColorTheme(color)}
                  className={cn(
                    "w-full aspect-square rounded-lg border-2 transition-all",
                    colorTheme === color ? "border-white ring-2 ring-blue-500" : "border-transparent"
                  )}
                  style={{
                    background: `linear-gradient(to br, ${color}, ${color})`
                  }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Custom Color
              </label>
              <input
                type="color"
                value={colorTheme}
                onChange={(e) => setColorTheme(e.target.value)}
                className="w-full h-10 rounded-md cursor-pointer"
              />
            </div>

            <div className="h-20 rounded-lg overflow-hidden" style={{ background: getGradient() }}>
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-lg font-medium">Preview</p>
              </div>
            </div>
          </div>
        </ThemeCard>

        {/* Data Sharing */}
        <ThemeCard
          title="Data & Analytics"
          description="Configure your data sharing preferences"
          icon={<Share2 className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Enable Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Collect usage data to improve your experience
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dataAnalyticsEnabled}
                  onChange={(e) => setDataAnalyticsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Share Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  Share anonymous data to help improve the platform (10% discount)
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareDataAnalytics}
                  onChange={(e) => setShareDataAnalytics(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </ThemeCard>
      </div>
    </div>
  );
}
