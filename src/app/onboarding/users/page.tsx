'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users as UsersIcon } from 'lucide-react';
import { CompleteOrder } from '@/app/components/CompleteOrder';
import { useUserStore } from '@/app/stores/useUserStore';
import { useBillingStore } from '@/app/stores/useBillingStore';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { useDemoStore } from '@/app/stores/useDemoStore';

type UserRole = 'admin' | 'manager' | 'viewer' | 'driver' | 'mobile';

interface NewTeamMember {
  email: string;
  role: UserRole;
  name?: string;
  phone?: string;
}

export default function Users() {
  const router = useRouter();
  const { isDemoMode } = useDemoAuth();
  const { addUser: addDemoUser } = useDemoStore();
  const [bulkEmails, setBulkEmails] = useState('');
  const [activeTab, setActiveTab] = useState<'team' | 'drivers' | 'mobile'>('team');
  const [newMember, setNewMember] = useState<NewTeamMember>({
    email: '',
    role: 'viewer',
    name: '',
    phone: '',
  });

  const { mobileAppEnabled } = useBillingStore();
  const { addTeamMember } = useUserStore();

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.email) return;

    if (isDemoMode()) {
      addDemoUser(newMember);
    } else {
      addTeamMember(newMember);
    }

    setNewMember({
      email: '',
      role: activeTab === 'team' ? 'viewer' : activeTab === 'drivers' ? 'driver' : 'mobile',
      name: '',
      phone: '',
    });
  };

  const handleBulkInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const emails = bulkEmails
      .split('\n')
      .map(email => email.trim())
      .filter(email => email && email.includes('@'));

    const role = activeTab === 'team' ? 'viewer' : activeTab === 'drivers' ? 'driver' : 'mobile';

    emails.forEach(email => {
      if (isDemoMode()) {
        addDemoUser({ email, role });
      } else {
        addTeamMember({ email, role });
      }
    });
    setBulkEmails('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/onboarding/vehicles');
  };

  const getAvailableRoles = () => {
    if (activeTab === 'team') return ['admin', 'manager', 'viewer'] as UserRole[];
    if (activeTab === 'drivers') return ['driver'] as UserRole[];
    return ['mobile'] as UserRole[];
  };

  const canAddMobileUsers = mobileAppEnabled || activeTab === 'team';
  const showMobileWarning = !mobileAppEnabled && (activeTab === 'drivers' || activeTab === 'mobile');

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
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
          <h2 className="text-2xl font-bold">
            Demo Mode: Manage Users
          </h2>
          <p className="mt-1 opacity-90">Add team members, drivers, and mobile users to your account</p>
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
                  This is a demonstration account. You can explore the interface and see how user management works, but no actual users will be added to the system. Feel free to interact with the forms to experience the full functionality.
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex items-center space-x-4" aria-label="Tabs">
            {[
              { name: 'Team Members', key: 'team' },
              { name: 'Drivers', key: 'drivers' },
              { name: 'Mobile Users', key: 'mobile' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as 'team' | 'drivers' | 'mobile');
                  setNewMember(prev => ({
                    ...prev,
                    role: tab.key === 'team' ? 'viewer' : tab.key === 'drivers' ? 'driver' : 'mobile',
                    name: '',
                    phone: '',
                  }));
                }}
                className={`
                  relative backdrop-blur-sm rounded-lg py-2 px-4 text-sm font-medium transition-all duration-200
                  ${activeTab === tab.key
                    ? 'text-white bg-gradient-to-r from-blue-600/90 to-cyan-500/90 shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'}
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
          {showMobileWarning && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-lg dark:bg-yellow-950/30 dark:border-yellow-900">
              <div className="flex items-start gap-3">
                <div className="text-yellow-800 dark:text-yellow-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Mobile App Required</h4>
                  <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                    To add {activeTab === 'drivers' ? 'drivers' : 'mobile users'}, you need to enable the mobile app in your subscription.
                    Please go back to the subscription page to enable this feature.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {/* Add Individual Member */}
            <div className="relative backdrop-blur-xl bg-white/90 dark:bg-black/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-200">

              <div className="relative flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900 dark:to-blue-950 rounded-md shadow-sm">
                  <UsersIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-foreground">
                  Add {activeTab === 'team' ? 'Team Member' : activeTab === 'drivers' ? 'Driver' : 'Mobile User'}
                </h3>
              </div>
              <form onSubmit={handleAddMember} className="mt-4 space-y-4">
                {(activeTab === 'drivers' || activeTab === 'mobile') && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={newMember.name || ''}
                      onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all duration-200 hover:border-blue-200"
                      placeholder="John Doe"
                      disabled={!canAddMobileUsers}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="user@example.com"
                    disabled={!canAddMobileUsers}
                  />
                </div>

                {(activeTab === 'drivers' || activeTab === 'mobile') && (
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={newMember.phone || ''}
                      onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="+1 (555) 123-4567"
                      disabled={!canAddMobileUsers}
                    />
                  </div>
                )}

                {activeTab === 'team' && (
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-foreground">
                      Role
                    </label>
                    <select
                      id="role"
                      value={newMember.role}
                      onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value as UserRole }))}
                      className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {getAvailableRoles().map(role => (
                        <option key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add {activeTab === 'team' ? 'Team Member' : activeTab === 'drivers' ? 'Driver' : 'Mobile User'}
                </button>
              </form>
            </div>

            {/* Bulk Invite Section */}
            <div className="relative backdrop-blur-xl bg-white/90 dark:bg-black/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg hover:shadow-xl transition-all duration-200">

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-md">
                  <UsersIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-foreground">
                  Bulk Invite {activeTab === 'team' ? 'Team Members' : activeTab === 'drivers' ? 'Drivers' : 'Mobile Users'}
                </h3>
              </div>
              <form onSubmit={handleBulkInvite} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="bulk-emails" className="block text-sm font-medium text-foreground">
                    Email List (one per line)
                  </label>
                  <textarea
                    id="bulk-emails"
                    rows={5}
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                    className="mt-1 block w-full rounded-md border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="user1@example.com&#10;user2@example.com"
                    disabled={!canAddMobileUsers}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Send Invites
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <CompleteOrder
          onComplete={handleSubmit}
          description="You can now proceed to vehicle setup."
        />
      </div>
    </div>
  );
}