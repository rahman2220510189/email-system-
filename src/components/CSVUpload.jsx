import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function CSVUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a CSV file first!');
      return;
    }

    const formData = new FormData();
    formData.append('csv', file);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3000/api/contacts/import-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(res.data.message);
      fetchContacts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed!');
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/contacts');
      setContacts(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch contacts');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/contacts/${id}`);
      toast.success('Contact deleted!');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to delete contact');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Import Contacts from CSV</h2>
        
        <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-blue-50">
          <p className="text-gray-500 mb-2">CSV format: name, email, phone, businessName</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block mx-auto text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>

        {file && (
          <p className="mt-3 text-sm text-green-600">✅ Selected: {file.name}</p>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          {loading ? 'Uploading...' : 'Upload CSV'}
        </button>
      </div>

      {/* CSV Format Guide */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">📌 CSV Format Example</h2>
        <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
          <p>name,email,phone,businessName</p>
          <p>John Smith,john@shop.com,+35799123456,John's Shop</p>
          <p>Maria Doe,maria@store.com,+35799654321,Maria Store</p>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">👥 All Contacts</h2>
          <button
            onClick={fetchContacts}
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm"
          >
            🔄 Refresh
          </button>
        </div>

        {contacts.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No contacts yet. Upload a CSV to get started.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Phone</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Business</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{contact.name}</td>
                    <td className="px-4 py-3">{contact.email}</td>
                    <td className="px-4 py-3">{contact.phone || '-'}</td>
                    <td className="px-4 py-3">{contact.businessName || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        contact.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        contact.status === 'contacted' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(contact._id)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        🗑 Delete
                      </button>
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

export default CSVUpload;