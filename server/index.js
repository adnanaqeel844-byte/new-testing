
// server/index.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Metadata endpoint
app.get('/api/metadata', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' }
    });

    const $ = cheerio.load(response.data);
    const meta = (name) =>
      $(`meta[property="${name}"]`).attr('content') || $(`meta[name="${name}"]`).attr('content') || '';

    const data = {
      title: $('title').first().text() || meta('og:title'),
      description: meta('og:description') || meta('description'),
      image: meta('og:image'),
      url
    };

    return res.json(data);
  } catch (err) {
    console.error('fetch error', err.message);
    return res.status(500).json({ error: 'Could not fetch URL: ' + err.message });
  }
});

// Serve React build (if present)
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Bind to PORT for Render (use process.env.PORT)
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server started on port', PORT);
});