import { useState, useEffect } from 'react';
import api from '../Api/Api';

export default function AccessManagement() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setUsers(data.data);
    } catch (err) {
      console.error('Failed to load users', err);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/auth/users');
        setUsers(data.data);
      } catch (err) {
        console.error('Failed to load users', err);
      }
    };
    fetchUsers();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await api.post('/auth/users', { email, password });
      setMessage(`✅ Access granted to ${email}`);
      setEmail('');
      setPassword('');
      loadUsers();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Failed to add user'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (targetEmail) => {
    if (!window.confirm(`Remove access for ${targetEmail}?`)) return;
    try {
      await api.delete(`/auth/users/${encodeURIComponent(targetEmail)}`);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove user');
    }
  };

  return (
    <div className="max-w-md">
      <h2 className="text-lg font-semibold mb-4">Manage Access</h2>

      <ul className="mb-6 divide-y border rounded">
        {users.map((u) => (
          <li key={u.email} className="flex items-center justify-between px-3 py-2">
            <span className="text-sm">{u.email}</span>
            <button onClick={() => handleRemove(u.email)} className="text-xs text-red-600 hover:underline">
              Remove
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="space-y-3">
        <input
          type="email"
          required
          placeholder="New person's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="Temporary password (min 8 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding…' : 'Add person'}
        </button>
      </form>

      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
  );
}