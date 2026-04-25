import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import CSVUpload from './components/CSVUpload';
import EmailCampaign from './components/EmailCampaign';
import WhatsappCampaign from './components/WhatsappCampaign';
import Logs from './components/Logs';

function App() {
  const [activeTab, setActiveTab] = useState('csv');

  const tabs = [
    { id: 'csv', label: '📋 CSV Upload' },
    { id: 'email', label: '✉️ Email Campaign' },
    { id: 'whatsapp', label: '💬 WhatsApp Campaign' },
    { id: 'logs', label: '📊 Logs' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            🚀 Ainoviro Outreach Panel
          </h1>
          <p className="text-gray-500 text-sm">Vendor acquisition dashboard</p>
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
        </div>
      </div>
    </div>
  );
}

export default App;