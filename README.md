# zohodummy
Zoho CRM Leads Fetcher and Database Saver
This project allows you to fetch leads data from Zoho CRM and store them in a MongoDB database. It includes an API to fetch leads, log the data to the console, and store it in MongoDB. The application also has a feature to fetch and store the leads in MongoDB by hitting a dedicated API.

Features
Fetch Leads from Zoho CRM: The application uses the Zoho CRM API to fetch leads data.
Store Leads in MongoDB: The fetched leads are then stored in a MongoDB database.
Logging: Logs the fetched leads and the result of database insertion in the console for debugging and monitoring.
Prerequisites
Before running this project, ensure you have the following installed:

Node.js (version 14 or later) - Download Node.js
MongoDB - Install MongoDB or use a cloud MongoDB service.
Postman (for testing the API) - Download Postman
Setup
1. Clone the Repository
Clone this repository to your local machine:

bash
Copy code
git clone <your-repository-url>
cd <project-folder>
2. Install Dependencies
Navigate to the project folder and install the necessary dependencies:

bash
Copy code
npm install
3. Configure .env File
Create a .env file in the root directory of the project. Add the following configurations:

env
Copy code
ZOHO_CLIENT_ID=your_zoho_client_id
ZOHO_CLIENT_SECRET=your_zoho_client_secret
ZOHO_REDIRECT_URI=http://localhost:5000/oauth/callback
ZOHO_REFRESH_TOKEN=your_zoho_refresh_token
ZOHO_API_DOMAIN=https://www.zohoapis.in
MONGO_URI=mongodb://localhost:27017/zoho_leads_db  # Replace with your MongoDB connection string
Replace your_zoho_client_id, your_zoho_client_secret, and your_zoho_refresh_token with your actual Zoho API credentials. The MONGO_URI is your MongoDB connection string, which could be a local or cloud-based MongoDB instance.

4. Start MongoDB
Ensure that MongoDB is running locally, or if you're using a cloud MongoDB instance, make sure the connection string in the .env file is correct.

If you're using a local MongoDB instance, start it using:

bash
Copy code
mongod
5. Start the Application
Once your .env file is configured, and MongoDB is running, you can start the application using:

bash
Copy code
npm start
This will start the server on http://localhost:5000.

API Endpoints
1. GET /api/leads
This endpoint fetches leads data from Zoho CRM and returns it as a JSON response.

Example Request:

bash
Copy code
GET http://localhost:5000/api/leads
Example Response:

json
Copy code
[
  {
    "lead_id": "12345",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890"
  },
  ...
]
2. GET /api/leads/storeDB
This endpoint fetches the leads from Zoho CRM and stores them in a MongoDB database. It logs the fetched data and the result of the database insertion in the console.

Example Request:

bash
Copy code
GET http://localhost:5000/api/leads/storeDB
Console Logs:

Logs the leads data fetched from Zoho CRM.
Logs the result of the MongoDB insertion.
Example Response:

json
Copy code
{
  "message": "Leads stored in the database successfully!"
}
Database
The fetched leads data is stored in a MongoDB collection.
The database connection URI can be configured in the .env file.
The database name used in this project is zoho_leads_db.
Folder Structure
bash
Copy code
zoho-crm-leads-fetcher/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection setup
│   ├── controllers/
│   │   └── leadsController.js   # Logic for fetching and saving leads
│   ├── models/
│   │   └── Lead.js              # MongoDB model for the leads
│   ├── server.js                # Main server file
├── .env                          # Environment variables file
├── package.json                  # Node.js package configuration
├── README.md                     # Project documentation



Troubleshooting
MongoDB Connection Error: Make sure your MongoDB instance is running, or check if your connection string is correct.
Zoho API Issues: Verify that your Zoho API credentials (Client ID, Client Secret, and Refresh Token) are correctly set in the .env file.
Console Logs: If you're not seeing any logs in the console, make sure your API requests are hitting the correct endpoints and MongoDB is accessible.
