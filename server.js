
const express = require('express');

const mongoose = require('mongoose');
const { fetchLeads } = require('./zcrm_config');  // Import the function to fetch leads
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define a schema for the leads data
const leadSchema = new mongoose.Schema({
  data: mongoose.Schema.Types.Mixed,  // Store the entire lead data as mixed type
  createdAt: { type: Date, default: Date.now }
});

// Create a model for the leads collection
const Lead = mongoose.model('Lead', leadSchema);


// ////////////store data and not check if it is already present if it present then it will stop the execution /////////

// Route to fetch leads from Zoho CRM
app.get('/api/leads', async (req, res) => {
  try {
    const leadsData = await fetchLeads();  // Fetch the lead data
    
    console.log('Fetched Leads Data:', leadsData);  // Log the leads data in console
    
    res.json(leadsData);  // Send leads data as a response
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});







/////-----it will note make duplicate if data is already present in the database then it replace with the new one-----\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// // Route to fetch leads and store them in MongoDB
app.get('/api/leads/storeDB', async (req, res) => {
  try {
    const leadsData = await fetchLeads(); // Fetch leads data from Zoho

    console.log('Fetched Leads Data:', leadsData); // Log the leads data in the console

    if (leadsData && leadsData.data) {
      // Use bulkWrite to avoid duplicate entries and update existing ones
      const leadDocs = leadsData.data.map(lead => ({
        updateOne: {
          filter: { 'data.id': lead.id }, // Use the unique lead ID
          update: { $set: { data: lead } },
          upsert: true, // Insert if the record doesn't exist
        },
      }));

      // Perform bulk write with upsert
      const result = await Lead.bulkWrite(leadDocs);

      // Log the result of the bulk write operation
      console.log('Leads stored or updated in the database:', result);

      res.json({ message: 'Leads stored or updated in the database successfully!' });
    } else {
      res.status(400).json({ error: 'No leads data found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to store leads in the database' });
  }
});



// Route to fetch leads and store them based on email uniqueness
app.get('/lead/StoreDB/Email', async (req, res) => {
  try {
    const leadsData = await fetchLeads(); // Fetch leads data from Zoho
    console.log('Fetched Leads Data:', leadsData); // Log the fetched leads data in the console

    if (leadsData && leadsData.data) {
      // Extract email IDs from the fetched data
      const fetchedEmails = leadsData.data.map((lead) => lead.email);

      // Query the database to find existing emails
      const existingEmails = await Lead.find({ 'data.email': { $in: fetchedEmails } }).select('data.email');

      // Extract the existing email list
      const existingEmailList = existingEmails.map((entry) => entry.data.email);

      // Separate new leads (emails not in the database)
      const newLeads = leadsData.data.filter((lead) => !existingEmailList.includes(lead.email));

      // Log existing and new emails
      console.log('Existing Emails:', existingEmailList);
      console.log('New Emails:', newLeads.map((lead) => lead.email));

      // Prepare bulkWrite operation for new leads only
      const leadDocs = newLeads.map((lead) => ({
        updateOne: {
          filter: { 'data.email': lead.email }, // Match by email
          update: { $set: { data: lead } },
          upsert: true, // Insert if not exists
        },
      }));

      // Perform the bulkWrite operation
      const result = await Lead.bulkWrite(leadDocs);

      // Respond with existing and new email information
      res.json({
        message: 'Operation completed.',
        existingEmails: existingEmailList,
        newEmails: newLeads.map((lead) => lead.email),
        databaseResponse: result,
      });
    } else {
      res.status(400).json({ error: 'No leads data found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to store leads in the database' });
  }
});



// Route to fetch company names from the stored leads in MongoDB
app.get('/api/leads/companies', async (req, res) => {
  try {
    // Fetch all leads from MongoDB
    const leadsData = await Lead.find();  // Assuming `Lead` is your MongoDB model

    console.log('Fetched Leads from MongoDB:', leadsData);

    if (leadsData && leadsData.length > 0) {
      // Extract company names from the leads data
      const companyNames = leadsData.map(lead => lead.data.Company);  // Assuming `Company` field exists in the data

      // Remove duplicates using Set
      const uniqueCompanyNames = [...new Set(companyNames)];

      console.log('Unique Company Names:', uniqueCompanyNames);  // Log the unique company names

      // Return the list of unique company names
      res.json({ companies: uniqueCompanyNames });
    } else {
      res.status(400).json({ error: 'No leads data found in the database' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch company names from leads' });
  }
});



// Route to fetch all names from Zoho CRM Leads tab
app.get('/leads/names', async (req, res) => {
  try {
    // Fetch leads directly from Zoho CRM
    const leadsData = await fetchLeads(); // Use the fetchLeads function to get data from Zoho CRM

    console.log('Fetched Leads Data from Zoho CRM:', leadsData); // Log the fetched leads

    if (leadsData && leadsData.data) {
      // Extract names from the leads data
      const leadNames = leadsData.data.map(lead => lead.Full_Name); // Assuming `Full_Name` field exists in Zoho leads

      // Remove duplicates using Set
      const uniqueNames = [...new Set(leadNames)];

      console.log('Unique Lead Names from Zoho CRM:', uniqueNames); // Log unique names

      // Return the list of unique names
      res.json({ names: uniqueNames });
    } else {
      res.status(400).json({ error: 'No leads data found in Zoho CRM' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch names from Zoho CRM' });
  }
});


// Route to fetch all emails from Zoho CRM Leads tab
app.get('/leads/email', async (req, res) => {
  try {
    // Fetch leads directly from Zoho CRM
    const leadsData = await fetchLeads(); // Use the fetchLeads function to get data from Zoho CRM

    console.log('Fetched Leads Data from Zoho CRM:', leadsData); // Log the fetched leads

    if (leadsData && leadsData.data) {
      // Extract email addresses from the leads data
      const emailAddresses = leadsData.data.map(lead => lead.Email); // Assuming `Email` field exists in Zoho leads

      // Remove duplicates using Set
      const uniqueEmails = [...new Set(emailAddresses)];

      console.log('Unique Email Addresses from Zoho CRM:', uniqueEmails); // Log unique email addresses

      // Return the list of unique email addresses
      res.json({ emails: uniqueEmails });
    } else {
      res.status(400).json({ error: 'No leads data found in Zoho CRM' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch email addresses from Zoho CRM' });
  }
});




// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
