import { useState, useEffect } from 'react';
import api from '../Api/Api';

function Dashboard({ setActiveTab }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats');
        setStats(res.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', padding: '40px 20px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚡</div>
        <h1 style={{ 
          fontSize: '42px', 
          fontWeight: '800', 
          background: 'linear-gradient(90deg, #a78bfa, #818cf8, #38bdf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0
        }}>
          Ainoviro Outreach
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '16px' }}>
          Vendor Acquisition Dashboard
        </p>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading...</p>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          maxWidth: '900px',
          margin: '0 auto 40px'
        }}>
          {[
            { label: 'Total Contacts', value: stats?.totalContacts || 0, icon: '👥', color: '#6366f1' },
            { label: 'Emails Sent', value: stats?.sentEmails || 0, icon: '✉️', color: '#10b981' },
            { label: 'Failed', value: stats?.failedEmails || 0, icon: '❌', color: '#ef4444' },
            { label: 'Unsubscribed', value: stats?.unsubscribed || 0, icon: '🚫', color: '#f59e0b' },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              transition: 'transform 0.2s',
              cursor: 'default'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: stat.color }}>{stat.value}</div>
              <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ maxWidth: '900px', margin: '0 auto 40px' }}>
        <h2 style={{ color: '#e2e8f0', fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>
          ⚡ Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {[
            { label: 'CSV Campaign', icon: '📋', tab: 'csv', color: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
            { label: 'Email Campaign', icon: '✉️', tab: 'email', color: 'linear-gradient(135deg, #3b82f6, #6366f1)' },
            { label: 'Run Scraper', icon: '🕷️', tab: 'scraper', color: 'linear-gradient(135deg, #8b5cf6, #ec4899)' },
            { label: 'View Logs', icon: '📊', tab: 'logs', color: 'linear-gradient(135deg, #10b981, #3b82f6)' },
          ].map((action) => (
            <button
              key={action.tab}
              onClick={() => setActiveTab(action.tab)}
              style={{
                background: action.color,
                border: 'none',
                borderRadius: '12px',
                padding: '20px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                transition: 'transform 0.2s, opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={{ fontSize: '28px' }}>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {stats?.recentLogs?.length > 0 && (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ color: '#e2e8f0', fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>
            🕐 Recent Activity
          </h2>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            {stats.recentLogs.map((log, i) => (
              <div key={log._id} style={{
                padding: '14px 20px',
                borderBottom: i < stats.recentLogs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '18px' }}>
                    {log.status === 'sent' ? '✅' : '❌'}
                  </span>
                  <span style={{ color: '#cbd5e1', fontSize: '14px' }}>
                    {log.email}
                  </span>
                </div>
                <span style={{ color: '#64748b', fontSize: '12px' }}>
                  {new Date(log.sentAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;