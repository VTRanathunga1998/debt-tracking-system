import { 
  BarChart3, 
  Users, 
  DollarSign, 
  FileText, 
  Settings, 
  LogOut, 
  LucideIcon 
} from 'lucide-react';

// Navigation items for the sidebar
const navigation = [
  { name: "Dashboard", icon: BarChart3 },
  { name: "Borrowers", icon: Users },
  { name: "Loans", icon: DollarSign },
  { name: "Payments", icon: FileText },
  { name: "Settings", icon: Settings },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
}

export default function Sidebar({ activeTab, onTabChange, isOpen }: SidebarProps) {
  // Mock user data - in a real app, this would come from auth context or API
  const user = {
    name: "John Doe",
    role: "Lender"
  };

  const handleLogout = () => {
    // Call logout function from auth context here
    console.log("Logout clicked");
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-xl transition duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
    >
      <div className="flex flex-col h-full p-4">
        {/* Logo */}
        <div className="flex items-center mb-8 p-2">
          <DollarSign className="h-8 w-8 text-indigo-600" />
          <span className="ml-2 text-xl font-bold text-gray-800">
            DebtTracker
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => onTabChange(item.name)}
              className={`w-full flex items-center p-3 rounded-lg transition-colors
                ${
                  activeTab === item.name
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </button>
          ))}
        </nav>

        {/* Profile & Logout */}
        <div className="border-t pt-4">
          <div className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="h-8 w-8 rounded-full"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {user.name}
              </p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-2 w-full flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}