import { useState } from 'react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', url: '/dashboard' },
    { id: 'analytics', icon: '📈', label: 'Analytics', url: '/analytics' },
    { id: 'users', icon: '👥', label: 'Users', url: '/users' },
    { id: 'products', icon: '🛒', label: 'Products', url: '/products' },
    { id: 'settings', icon: '⚙️', label: 'Settings', url: '/settings' }
  ];

  const currentTab = navItems.find(item => item.id === activeTab);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-indigo-700 text-white transition-all duration-200 ${sidebarExpanded ? 'w-64' : 'w-20'}`}>
        <div className="flex items-center justify-between p-4 border-b border-indigo-600">
          {sidebarExpanded && <h1 className="text-xl font-bold">Admin</h1>}
          <button 
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="p-1 rounded hover:bg-indigo-600"
            aria-label="Toggle sidebar"
          >
            {sidebarExpanded ? '◀' : '▶'}
          </button>
        </div>
        
        <nav className="p-2">
          <ul className="space-y-1">
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center w-full p-3 rounded-md transition-colors ${
                    activeTab === item.id 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-indigo-100 hover:bg-indigo-600'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {sidebarExpanded && (
                    <span className="ml-3">{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content with iframe */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-semibold capitalize">
              {currentTab?.label}
            </h2>
          </div>
        </header>
        
        <div className="flex-1">
          <iframe 
            src={currentTab?.url}
            title={currentTab?.label}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </main>
    </div>
  );
}