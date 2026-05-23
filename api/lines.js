// api/lines.js
// Proxies TfL line status requests to avoid CORS issues in the browser.
// Called as: /api/lines?ids=piccadilly,northern,victoria,elizabeth

export default async function handler(req, res) {
  const { ids } = req.query;

  if (!ids) {
    return res.status(400).json({ error: 'Missing ids parameter' });
  }

  try {
    const url = `https://api.tfl.gov.uk/Line/${ids}/Status`;
    const tflRes = await fetch(url);

    if (!tflRes.ok) {
      return res.status(tflRes.status).json({ error: 'TfL API error' });
    }

    const data = await tflRes.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch from TfL', detail: err.message });
  }
}
