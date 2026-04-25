import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const emailLogs = await axios.get('http://localhost:3000/api/email/logs');
      const whatsappLogs = await axios.get('http://localhost:3000/api/whatsapp/logs');
      const allLogs = [
        ...emailLogs.data.data,
        ...whatsappLogs.data.data
      ].sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
      setLogs(allLogs);
    } catch (error) {
      toast.error('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'email') return log.type === 'email';
    if (filter === 'whatsapp') return log.type === 'whatsapp';
    if (filter === 'sent') return log.status === 'sent';
    if (filter === 'failed') return log.status === 'failed';
    return true;
  });

  const stats = {
    total: logs.length,
    sent: logs.filter(l => l.status === 'sent').length,
    failed: logs.filter(l => l.status === 'failed').length,
    email: logs.filter(l => l.type === 'email').length,
    whatsapp: logs.filter(l => l.type === 'whatsapp').length,
  };

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-blue-50 text-blue-700' },
          { label: 'Sent', value: stats.sent, color: 'bg-green-50 text-green-700' },
          { label: 'Failed', value: stats.failed, color: 'bg-red-50 text-red-700' },
          { label: 'Emails', value: stats.email, color: 'bg-purple-50 text-purple-700' },
          { label: 'WhatsApp', value: stats.whatsapp, color: 'bg-yellow-50 text-yellow-700' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-xl p-4 text-center ${stat.color} shadow`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">📊 Campaign Logs</h2>
          <button
            onClick={fetchLogs}
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {['all', 'email', 'whatsapp', 'sent', 'failed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-8">Loading logs...</p>
        ) : filteredLogs.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No logs found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-gray-600">Type</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Contact</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Subject/Message</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Sent At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.type === 'email'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {log.type === 'email' ? '✉️ Email' : '💬 WhatsApp'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {log.email || log.phone}
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                      {log.subject || log.message || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.status === 'sent'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {log.status === 'sent' ? '✅ Sent' : '❌ Failed'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(log.sentAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Logs;