import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Palette,
  Mail,
  Lock,
  Smartphone,
  Check,
  ChevronRight,
  Crown,
  Zap,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const settingsTabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'preferences', label: 'Preferences', icon: Palette },
];

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-2">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-violet-500/20 text-violet-300'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Plan Card */}
          <div className="mt-4 p-4 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">{user?.plan} Plan</span>
            </div>
            <p className="text-violet-100 text-sm mb-4">
              {user?.plan === 'free' 
                ? 'Upgrade to unlock unlimited scripts and AI features'
                : 'You have access to all premium features'}
            </p>
            {user?.plan === 'free' && (
              <button className="w-full py-2 bg-white text-violet-600 font-medium rounded-lg hover:bg-violet-50 transition-colors">
                Upgrade Now
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6"
          >
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
                
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white text-2xl font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors">
                      Change Avatar
                    </button>
                    <p className="text-slate-500 text-sm mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                    <input
                      type="text"
                      defaultValue={user?.name.toLowerCase()}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="e.g., New York, USA"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-violet-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-violet-500/50 resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                  >
                    {saved ? <><Check className="w-4 h-4" /> Saved</> : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>
                
                <div className="space-y-4">
                  {[
                    { label: 'New script generated', desc: 'Get notified when AI finishes generating content', checked: true },
                    { label: 'Trending topics', desc: 'Weekly digest of trending topics in your niche', checked: true },
                    { label: 'Viral score updates', desc: 'When your content scores are calculated', checked: false },
                    { label: 'Product updates', desc: 'New features and improvements', checked: true },
                    { label: 'Marketing emails', desc: 'Tips, tricks, and promotional offers', checked: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start justify-between p-4 bg-slate-800/30 rounded-xl">
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-slate-500 text-sm">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Billing & Subscription</h2>
                
                <div className="p-6 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-violet-300 text-sm font-medium">Current Plan</p>
                      <p className="text-2xl font-bold text-white capitalize">{user?.plan}</p>
                    </div>
                    <Crown className="w-10 h-10 text-violet-400" />
                  </div>
                  {user?.plan === 'free' ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Zap className="w-4 h-4" />
                        <span>10 scripts/month</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Zap className="w-4 h-4" />
                        <span>Basic AI features</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400 text-sm">
                        <Check className="w-4 h-4" />
                        <span>Unlimited scripts</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400 text-sm">
                        <Check className="w-4 h-4" />
                        <span>AI thumbnails & viral scores</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-white font-medium">Payment Methods</h3>
                  <div className="p-4 bg-slate-800/30 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-slate-700 rounded flex items-center justify-center text-xs text-slate-400">VISA</div>
                      <span className="text-slate-300">•••• 4242</span>
                    </div>
                    <span className="text-emerald-400 text-sm">Default</span>
                  </div>
                  <button className="w-full py-3 border border-dashed border-slate-700 rounded-xl text-slate-400 hover:text-white hover:border-slate-500 transition-all">
                    + Add Payment Method
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Security Settings</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/30 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <Lock className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Password</p>
                          <p className="text-slate-500 text-sm">Last changed 3 months ago</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors">
                        Change
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-800/30 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Two-Factor Authentication</p>
                          <p className="text-slate-500 text-sm">Add extra security to your account</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm transition-colors">
                        Enable
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-800/30 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Active Sessions</p>
                          <p className="text-slate-500 text-sm">2 devices currently logged in</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors">
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Preferences</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
                    <select className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-violet-500/50">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Timezone</label>
                    <select className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:border-violet-500/50">
                      <option>UTC-05:00 Eastern Time</option>
                      <option>UTC-08:00 Pacific Time</option>
                      <option>UTC+00:00 London</option>
                      <option>UTC+01:00 Paris</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
                    <div>
                      <p className="text-white font-medium">Compact Mode</p>
                      <p className="text-slate-500 text-sm">Reduce spacing for more content</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
                    <div>
                      <p className="text-white font-medium">Auto-save Scripts</p>
                      <p className="text-slate-500 text-sm">Automatically save while editing</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
