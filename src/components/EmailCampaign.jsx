import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function EmailCampaign() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    campaignName: '',
    subject: '',
    body: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendBulk = async () => {
    if (!form.subject || !form.body || !form.campaignName) {
      toast.error('Please fill all fields!');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('https://outreach-demo.onrender.com/api/email/send-bulk', form);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start campaign!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-6">✉️ Email Campaign</h2>

        <div className="space-y-4">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              name="campaignName"
              value={form.campaignName}
              onChange={handleChange}
              placeholder="e.g. Cyprus Vendor Outreach April 2026"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Subject
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="e.g. Inquiry regarding your business digital presence"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              ⚠️ Do not use sales pitch in subject line
            </p>
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Body
            </label>
            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              rows={10}
              placeholder={`Hi [Name],

I found your business on Google Maps and wanted to reach out personally.

We are launching Ainoviro — a marketplace that connects sellers like you with thousands of motivated buyers in Cyprus.

✅ Free product listings
✅ AI-powered SEO suggestions
✅ Growing customer base

Sign up here: https://ainoviro.com

Best regards,
Ainoviro Team`}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">
              ⚠️ First line must explain where you found their contact
            </p>
          </div>

          {/* Rules Reminder */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-yellow-800 mb-2">📋 Campaign Rules</h3>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>✅ Max 50 emails per hour (auto throttled)</li>
              <li>✅ Do Not Contact list checked automatically</li>
              <li>✅ Unsubscribe link added automatically</li>
              <li>✅ All sends logged in database</li>
              <li>⚠️ Stop campaign if spam rate exceeds 0.1%</li>
            </ul>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendBulk}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            {loading ? '🚀 Starting Campaign...' : '🚀 Start Bulk Email Campaign'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailCampaign;