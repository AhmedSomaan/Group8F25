// index.js
require('dotenv').config(); // loads .env file
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4000;

// allow app to read JSON data
app.use(express.json());

// basic test route
app.get('/', (req, res) => {
  res.send('API is working!');
});

// Example route: simulate reading data from a database
app.get('/api/data', (req, res) => {
  // pretend this came from database
  const fakeData = [
    { id: 1, name: 'Ameer', city: 'Kitchener' },
    { id: 2, name: 'Trent', city: 'Waterloo' }
  ];
  res.json(fakeData);
});

// Example route: simulate writing data to database
app.post('/api/data', (req, res) => {
  const newData = req.body; // data sent from frontend
  console.log('Received new data:', newData);
  // pretend we saved it to database
  res.json({ message: 'Data received successfully!', data: newData });
});

// Simple Google Maps test route
app.get('/api/map', async (req, res) => {
  try {
    const address = req.query.address; // e.g. /api/map?address=Toronto
    const apiKey = process.env.Google_API_Key;

    // Use axios to call Google Maps API
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address: address,
          key: apiKey
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to connect to Google Maps' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
