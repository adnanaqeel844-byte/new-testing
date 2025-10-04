
// client/src/App.js
import React, { useState } from 'react';

export default function App() {
  const [url, setUrl] = useState('https://app-earnings-link.com/givvyVideo/cgcexv6ut47s7f4');
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const fetchMeta = async () => {
    setLoading(true); setErr('');
    setMeta(null);
    try {
      const r = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
      if (!r.ok) throw new Error(await r.text());
      const j = await r.json();
      setMeta(j);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'system-ui, Arial' }}>
      <h1>Link Preview</h1>
      <input value={url} onChange={e => setUrl(e.target.value)} style={{ width: '100%', padding: 8 }} />
      <div style={{ marginTop: 12 }}>
        <button onClick={fetchMeta}>Fetch metadata</button>
        <a style={{ marginLeft: 12 }} href={url} target="_blank" rel="noopener noreferrer">Open in new tab (manual)</a>
      </div>

      {loading && <p>Loading metadata…</p>}
      {err && <p style={{ color: 'red' }}>Error: {err}</p>}

      {meta && (
        <div style={{ marginTop: 20, border: '1px solid #ddd', padding: 12 }}>
          <h2>{meta.title}</h2>
          <p>{meta.description}</p>
          {meta.image && <img src={meta.image} alt="" style={{ maxWidth: '100%' }} />}
          <p><strong>Source:</strong> <a href={meta.url} target="_blank" rel="noopener noreferrer">{meta.url}</a></p>
          <p style={{ color: '#a00' }}>
            NOTE: This app does **not** automate playing/listening or attempt to increase any platform metrics.
            Users must open the source and interact manually.
          </p>
        </div>
      )}
    </div>
  );
}