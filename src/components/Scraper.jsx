import { useState, useEffect, useCallback } from 'react';
import api from '../Api/Api';
import toast from 'react-hot-toast';

function Scraper() {
  const [osmCategories, setOsmCategories] = useState([]);
  const [dirCategories, setDirCategories] = useState([]);
  const [selectedOsm, setSelectedOsm] = useState('');
  const [selectedDir, setSelectedDir] = useState('');
  const [logs, setLogs] = useState([]);
const [osmLoading, setOsmLoading] = useState(false);
const [dirLoading, setDirLoading] = useState(false);
  const fetchLogs = useCallback(async () => {
    try {
      const res = await api.get('/scraper/logs');
      setLogs(res.data.data);
    } catch {
      toast.error('Failed to fetch logs');
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [osm, dir] = await Promise.all([
          api.get('/scraper/categories'),
          api.get('/scraper/directory-categories')
        ]);
        setOsmCategories(osm.data.data);
        setDirCategories(dir.data.data);
      } catch {
        toast.error('Failed to fetch categories');
      }

      fetchLogs();
    };

    loadInitialData();
  }, [fetchLogs]);

  const runOsmScraper = async () => {
    if (!selectedOsm) {
      toast.error('Please select a category!');
      return;
    }
    try {
      setOsmLoading(true);
      const res = await api.post('/scraper/run', {
        categoryKey: selectedOsm
      });
      toast.success(res.data.message);
      setTimeout(() => { fetchLogs(); setOsmLoading(false); }, 3000);
    } catch {
      toast.error('Scraper failed!');
      setOsmLoading(false);
    }
  };

 const runDirectoryScraper = async () => {
    if (!selectedDir) {
      toast.error('Please select a category!');
      return;
    }
    try {
      setDirLoading(true);
      await api.post('/scraper/run-directory', {
        categoryKey: selectedDir,
        maxPagesPerSlug: 2
      });

      // Poll every 5 seconds until scraper finishes
      const interval = setInterval(async () => {
        const res = await api.get('/scraper/logs');
        const latestLog = res.data.data[0];
        if (latestLog && latestLog.completedAt) {
          clearInterval(interval);
          setDirLoading(false);
          setLogs(res.data.data);
          toast.success(`✅ Done! Added ${latestLog.added} contacts.`);
        }
      }, 5000);

    } catch {
      toast.error('Scraper failed!');
      setDirLoading(false);
    }
};

  return (
    <div className="space-y-6">

      {/* OSM Scraper */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2">🗺️ OpenStreetMap Scraper</h2>
        <p className="text-sm text-gray-500 mb-4">
          Physical businesses — shops, restaurants, gyms, salons, automotive, hotels
        </p>
        <div className="flex gap-3">
          <select
            value={selectedOsm}
            onChange={(e) => setSelectedOsm(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category...</option>
            {osmCategories.map(cat => (
              <option key={cat.key} value={cat.key}>{cat.label}</option>
            ))}
          </select>
        <button
    onClick={runOsmScraper}
    disabled={osmLoading}
    className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
>
    {osmLoading ? 'Running...' : '🚀 Run'}
</button>
        </div>
      </div>

      {/* Directory Scraper */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2">📋 Cyprus Atlas Scraper</h2>
        <p className="text-sm text-gray-500 mb-4">
          Service businesses — legal, consulting, education, events, health, finance
        </p>
        <div className="flex gap-3">
          <select
            value={selectedDir}
            onChange={(e) => setSelectedDir(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select a category...</option>
            {dirCategories.map(cat => (
              <option key={cat.key} value={cat.key}>{cat.label}</option>
            ))}
          </select>
          <button
            onClick={runDirectoryScraper}
            disabled={dirLoading}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
          >
{dirLoading ? 'Running...' : '🚀 Run'}          </button>
        </div>
      </div>

      {/* Scraper Logs */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">📊 Scraper History</h2>
          <button
            onClick={fetchLogs}
            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
          >
            🔄 Refresh
          </button>
        </div>

        {logs.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No scraper runs yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 font-medium text-gray-600">Source</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Category</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Found</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Added</th>
                  <th className="px-4 py-3 font-medium text-gray-600">No Email</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Export</th>

                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.type === 'scraper'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {log.type === 'scraper' ? '🗺️ OSM' : '📋 Atlas'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{log.category}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{log.totalFound || 0}</td>
                    <td className="px-4 py-3 font-medium text-green-600">{log.added || 0}</td>
                    <td className="px-4 py-3 text-red-500">{log.noEmail || 0}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(log.completedAt).toLocaleString()}
                    </td>


<td className="px-4 py-3">
  <button
    onClick={async () => {
      try {
        const res = await api.get('/scraper/export-csv', {
          params: { category: log.category, type: log.type },
          responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = `${log.category}_${log.type}_${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch {
        toast.error('Export failed!');
      }
    }}
    className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-200 whitespace-nowrap"
  >
    ⬇️ CSV
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

export default Scraper;