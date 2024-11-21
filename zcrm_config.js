const axios = require('axios');
require('dotenv').config();

// Function to get a new access token using the refresh token
async function refreshAccessToken() {
  try {
    const response = await axios.post('https://accounts.zoho.in/oauth/v2/token', null, {
      params: {
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: 'refresh_token',
      },
    });
    // Return the new access token
    return response.data.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error.response?.data || error.message);
    throw new Error('Unable to refresh access token');
  }
}

// Function to fetch leads using the current access token
async function fetchLeads() {
  const accessToken = await refreshAccessToken();  // Get the refreshed access token
  try {
    const response = await axios.get(`${process.env.ZOHO_API_DOMAIN}/crm/v2/Leads`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,  // Use the refreshed token
      },
    });
    return response.data;  // Return the leads data
  } catch (error) {
    console.error('Error fetching leads:', error.response?.data || error.message);
    throw new Error('Failed to fetch leads');
  }
}

module.exports = { fetchLeads };  // Export the fetchLeads function
