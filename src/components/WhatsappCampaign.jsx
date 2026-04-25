import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function WhatsappCampaign() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    campaignName: '',
    message: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendBulk = async () => {
    if (!form.message || !form.campaignName) {
      toast.error('Please fill all fields!');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('https://outreach-demo.onrender.com/api/whatsapp/send-bulk', form);
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
        <h2 className="text-lg font-bold text-gray-800 mb-6">💬 WhatsApp Campaign</h2>

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
              placeholder="e.g. Cyprus WhatsApp Outreach April 2026"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={8}
              placeholder={`Hi [Name], I'm from Ainoviro. We're helping Cyprus businesses grow their online presence. Would you be open to receiving a brief info deck about listing your products for free on our platform?`}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              ⚠️ Always ask for permission first — do not pitch directly
            </p>
          </div>

          {/* Character Count */}
          <div className="text-right">
            <span className={`text-xs font-medium ${form.message.length > 1024 ? 'text-red-500' : 'text-gray-400'}`}>
              {form.message.length}/1024 characters
            </span>
          </div>

          {/* Rules Reminder */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-green-800 mb-2">📋 WhatsApp Rules</h3>
            <ul className="text-xs text-green-700 space-y-1">
              <li>✅ Permission request first — no direct pitch</li>
              <li>✅ 1 message per 5 seconds (auto throttled)</li>
              <li>✅ Do Not Contact list checked automatically</li>
              <li>✅ All sends logged in database</li>
              <li>⚠️ Twilio WhatsApp API required</li>
            </ul>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendBulk}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 transition-all"
          >
            {loading ? '💬 Starting Campaign...' : '💬 Start Bulk WhatsApp Campaign'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WhatsappCampaign;