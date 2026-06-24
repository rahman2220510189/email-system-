import { useState } from 'react';
import api from '../Api/Api';
import toast from 'react-hot-toast';
import Papa from 'papaparse';

function CSVUpload() {
  const [, setFile] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ campaignName: '', subject: '', body: '' });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setContacts(results.data);
        toast.success(`✅ ${results.data.length} contacts loaded`);
      }
    });
  };

  const handleSend = async () => {
    if (!contacts.length) {
      toast.error('Please select a CSV file first!');
      return;
    }
    if (!form.subject || !form.body || !form.campaignName) {
      toast.error('Please fill all fields!');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/email/send-csv', {
        contacts,
        subject: form.subject,
        body: form.body,
        campaignName: form.campaignName
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Upload Box */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">📋 CSV Email Campaign</h2>

        <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-blue-50">
          <p className="text-gray-500 mb-2">CSV format: name, email, phone, businessName</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block mx-auto text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>

        {contacts.length > 0 && (
          <p className="mt-3 text-sm text-green-600">✅ {contacts.length} contacts ready to send</p>
        )}
      </div>

      {/* Email Form */}
      {contacts.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">✉️ Write Your Email</h2>
          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
              <input
                type="text"
                value={form.campaignName}
                onChange={(e) => setForm({ ...form, campaignName: e.target.value })}
                placeholder="e.g. Cyprus Vendor Outreach June 2026"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g. Inquiry regarding your business"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Body</label>
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={10}
                placeholder="Write your email body here..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <p className="text-xs text-gray-400 mt-1">⚠️ First line must explain where you found their contact</p>
            </div>

            {/* Rules */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-bold text-yellow-800 mb-2">📋 Campaign Rules</h3>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>✅ Max 50 emails per hour (auto throttled)</li>
                <li>✅ Do Not Contact list checked automatically</li>
                <li>✅ Unsubscribe link added automatically</li>
                <li>✅ Only sends to this CSV — not entire database</li>
              </ul>
            </div>

            <button
              onClick={handleSend}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              {loading ? '🚀 Sending...' : `🚀 Send to ${contacts.length} contacts`}
            </button>
          </div>
        </div>
      )}

      {/* Preview Table */}
      {contacts.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">👥 Preview Contacts</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Phone</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contacts.map((contact, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{contact.name || '-'}</td>
                    <td className="px-4 py-3">{contact.email || '-'}</td>
                    <td className="px-4 py-3">{contact.phone || '-'}</td>
                    <td className="px-4 py-3">{contact.businessName || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CSV Format Guide */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">📌 CSV Format Example</h2>
        <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
          <p>name,email,phone,businessName</p>
          <p>John Smith,john@shop.com,+35799123456,John's Shop</p>
          <p>Maria Doe,maria@store.com,+35799654321,Maria Store</p>
        </div>
      </div>

    </div>
  );
}

export default CSVUpload;