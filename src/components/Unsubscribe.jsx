import {  useState } from 'react';

function Unsubscribe() {
  const params = new URLSearchParams(window.location.search);
  const success = params.get('success');
  const email = params.get('email');

  // Initialize status from URL param to avoid calling setState synchronously inside an effect
  const [status] = useState(() => (success === 'true' ? 'success' : 'error'));

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{
        background: 'white',
        padding: '48px',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        textAlign: 'center',
        maxWidth: '480px'
      }}>
        {status === 'success' ? (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h1 style={{ color: '#111', marginBottom: '8px' }}>Unsubscribed</h1>
            <p style={{ color: '#666' }}>
              <strong>{email}</strong> has been removed from our mailing list.
              You will not receive any further emails from us.
            </p>
            <p style={{ color: '#999', fontSize: '12px', marginTop: '24px' }}>
              If this was a mistake, please contact us at{' '}
              <a href="mailto:info@ainoviro.com">info@ainoviro.com</a>
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
            <h1 style={{ color: '#111' }}>Something went wrong</h1>
            <p style={{ color: '#666' }}>Please try again or contact info@ainoviro.com</p>
          </>
        )}

        <div style={{ marginTop: '32px', fontSize: '11px', color: '#bbb' }}>
          <a href="https://www.ainoviro.com/privacy-policy" style={{ color: '#bbb' }}>Privacy Policy</a>
          {' · '}
          <a href="https://www.ainoviro.com/terms-conditions" style={{ color: '#bbb' }}>Terms & Conditions</a>
          <br />
          Ainoviro · Anafis 8, Larnaca, Cyprus
        </div>
      </div>
    </div>
  );
}

export default Unsubscribe;