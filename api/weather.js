// api/weather.js
// Proxies Open-Meteo weather requests.
// Called as: /api/weather?lat=51.613&lon=-0.158

export default async function handler(req, res) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing lat or lon parameter' });
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast`
      + `?latitude=${lat}&longitude=${lon}`
      + `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m`
      + `&wind_speed_unit=mph&timezone=Europe/London`;

    const weatherRes = await fetch(url);

    if (!weatherRes.ok) {
      return res.status(weatherRes.status).json({ error: 'Weather API error' });
    }

    const data = await weatherRes.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch weather', detail: err.message });
  }
}
