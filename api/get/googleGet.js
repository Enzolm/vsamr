const getMaps = async (req, res) => {
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.address}&key=${process.env.GOOGLE_MAPS_API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des données Google Maps" });
  }
};
