// api/arrivals.js
// Proxies TfL bus arrival requests to avoid CORS issues in the browser.
// Called as: /api/arrivals?stopId=490007029S

export default async function handler(req, res) {
  const { stopId } = req.query;

  if (!stopId) {
    return res.status(400).json({ error: 'Missing stopId parameter' });
  }

  try {
    const url = `https://api.tfl.gov.uk/StopPoint/${stopId}/Arrivals`;
    const tflRes = await fetch(url);

    if (!tflRes.ok) {
      return res.status(tflRes.status).json({ error: 'TfL API error' });
    }

    const data = await tflRes.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch from TfL', detail: err.message });
  }
}
