"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SettingsContent() {
  const { lender } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Form states for different settings
  const [profileForm, setProfileForm] = useState({
    name: lender?.name || "",
    email: lender?.email || "",
    phone: "",
    address: "",
    company: ""
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newLoanNotifications: true,
    paymentNotifications: true,
    overdueNotifications: true,
    marketingEmails: false
  });
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Settings Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          <button 
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
              activeTab === 'profile' 
                ? 'border-b-2 border-indigo-600 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
              activeTab === 'notifications' 
                ? 'border-b-2 border-indigo-600 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button 
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
              activeTab === 'security' 
                ? 'border-b-2 border-indigo-600 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
          <button 
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
              activeTab === 'preferences' 
                ? 'border-b-2 border-indigo-600 text-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
        </div>
      </div>
      
      {/* Settings Content */}
      <div className="p-6">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Profile Settings</h2>
            <p className="text-sm text-gray-500">
              Update your personal information and how it appears in the system.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input 
                  type="text" 
                  name="company"
                  value={profileForm.company}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input 
                  type="text" 
                  name="address"
                  value={profileForm.address}
                  onChange={handleProfileChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
            <p className="text-sm text-gray-500">
              Manage how and when you receive notifications about account activity.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onChange={handleNotificationChange}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-700">New Loan Notifications</p>
                  <p className="text-xs text-gray-500">Get notified when a new loan is created</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="newLoanNotifications"
                    checked={notificationSettings.newLoanNotifications}
                    onChange={handleNotificationChange}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-700">Payment Notifications</p>
                  <p className="text-xs text-gray-500">Get notified when payments are made</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="paymentNotifications"
                    checked={notificationSettings.paymentNotifications}
                    onChange={handleNotificationChange}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-700">Overdue Notifications</p>
                  <p className="text-xs text-gray-500">Get notified when payments are overdue</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="overdueNotifications"
                    checked={notificationSettings.overdueNotifications}
                    onChange={handleNotificationChange}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-700">Marketing Emails</p>
                  <p className="text-xs text-gray-500">Receive marketing and promotional emails</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="marketingEmails"
                    checked={notificationSettings.marketingEmails}
                    onChange={handleNotificationChange}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Save Preferences
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
            <p className="text-sm text-gray-500">
              Manage your password and account security options.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-2">Change Password</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input 
                      type="password" 
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input 
                      type="password" 
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input 
                      type="password" 
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Update Password
                  </button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-md font-medium text-gray-800 mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Enable Two-Factor Authentication
                </button>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-md font-medium text-gray-800 mb-2">Active Sessions</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Manage and sign out of your active sessions.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Current Session</p>
                      <p className="text-xs text-gray-500">Started 2 hours ago - Chrome on Windows</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Active Now
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Preferences</h2>
            <p className="text-sm text-gray-500">
              Customize your application experience.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-2">Theme Settings</h3>
                <div className="flex gap-4 mt-2">
                  <button className="p-4 border border-gray-200 rounded-lg bg-white hover:border-indigo-500 transition-colors">
                    Light
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg bg-gray-800 text-white hover:border-indigo-500 transition-colors">
                    Dark
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-white to-gray-800 text-gray-800 hover:border-indigo-500 transition-colors">
                    System
                  </button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-md font-medium text-gray-800 mb-2">Language</h3>
                <select className="w-full max-w-xs rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-md font-medium text-gray-800 mb-2">Date Format</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="dateFormat" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700">MM/DD/YYYY (US)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="dateFormat" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" />
                    <span className="ml-2 text-sm text-gray-700">DD/MM/YYYY (UK, EU)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="dateFormat" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" />
                    <span className="ml-2 text-sm text-gray-700">YYYY-MM-DD (ISO)</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}