import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import CSVUpload from './components/CSVUpload';
import EmailCampaign from './components/EmailCampaign';
import WhatsappCampaign from './components/WhatsappCampaign';
import Logs from './components/Logs';
import Scraper from './components/Scraper';
import Login from './Login/Login';
import AccessManagement from './Login/Accessmanagement';
import Unsubscribe from './components/Unsubscribe';
function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ainoviro_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('csv');
 if (window.location.pathname === '/unsubscribe') {
    return <Unsubscribe />;
  }
  // Nothing below this renders until someone is actually logged in.
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const handleLogout = () => {
    localStorage.removeItem('ainoviro_token');
    localStorage.removeItem('ainoviro_user');
    setUser(null);
  };

  const tabs = [
    { id: 'csv', label: '📋 CSV Upload' },
    { id: 'email', label: '✉️ Email Campaign' },
    { id: 'whatsapp', label: '💬 WhatsApp Campaign' },
    { id: 'scraper', label: '🕷️ Scraper' },
    { id: 'logs', label: '📊 Logs' },
    { id: 'access', label: '🔐 Access' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              🚀 Ainoviro Outreach Panel
            </h1>
            <p className="text-gray-500 text-sm">Vendor acquisition dashboard</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">{user.email}</p>
            <button onClick={handleLogout} className="text-xs text-red-500 hover:underline">
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex gap-2 bg-white rounded-xl p-2 shadow">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'csv' && <CSVUpload />}
          {activeTab === 'email' && <EmailCampaign />}
          {activeTab === 'whatsapp' && <WhatsappCampaign />}
          {activeTab === 'logs' && <Logs />}
          {activeTab === 'scraper' && <Scraper />}
          {activeTab === 'access' && <AccessManagement />}
        </div>
      </div>
    </div>
  );
}

export default App;