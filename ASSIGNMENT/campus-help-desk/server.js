const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'requests.json');

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Helper: Read requests from requests.json using Node.js fs module
const readRequests = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

// Helper: Write requests to requests.json using Node.js fs module
const writeRequests = async (requests) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(requests, null, 2), 'utf-8');
};

// 1. GET /api/requests - Fetch all campus requests
app.get('/api/requests', async (req, res) => {
  try {
    const requests = await readRequests();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error reading requests data', error: error.message });
  }
});

// 2. GET /api/requests/:id - Fetch a single request by ID
app.get('/api/requests/:id', async (req, res) => {
  try {
    const requests = await readRequests();
    const request = requests.find((r) => r.id.toLowerCase() === req.params.id.toLowerCase());

    if (!request) {
      return res.status(404).json({ message: `Request with ID ${req.params.id} not found.` });
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching request', error: error.message });
  }
});

// 3. POST /api/requests - Submit a new request
app.post('/api/requests', async (req, res) => {
  try {
    const { studentName, email, category, priority, description } = req.body;

    // Simple validation
    if (!studentName || !email || !category || !priority || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const requests = await readRequests();

    // Generate unique ID (e.g., REQ-105)
    const newId = `REQ-${Date.now().toString().slice(-4)}`;

    const newRequest = {
      id: newId,
      studentName: studentName.trim(),
      email: email.trim(),
      category: category.trim(),
      priority: priority.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString()
    };

    requests.unshift(newRequest);
    await writeRequests(requests);

    res.status(201).json({
      message: 'Campus help request submitted successfully!',
      request: newRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving request', error: error.message });
  }
});

// 4. PUT /api/requests/:id - Update an existing request
app.put('/api/requests/:id', async (req, res) => {
  try {
    const { studentName, email, category, priority, description } = req.body;

    if (!studentName || !email || !category || !priority || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const requests = await readRequests();
    const index = requests.findIndex((r) => r.id.toLowerCase() === req.params.id.toLowerCase());

    if (index === -1) {
      return res.status(404).json({ message: `Request with ID ${req.params.id} not found.` });
    }

    const updatedRequest = {
      ...requests[index],
      studentName: studentName.trim(),
      email: email.trim(),
      category: category.trim(),
      priority: priority.trim(),
      description: description.trim(),
      updatedAt: new Date().toISOString()
    };

    requests[index] = updatedRequest;
    await writeRequests(requests);

    res.status(200).json({
      message: 'Campus help request updated successfully!',
      request: updatedRequest
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating request', error: error.message });
  }
});

// 5. DELETE /api/requests/:id - Delete a request
app.delete('/api/requests/:id', async (req, res) => {
  try {
    const requests = await readRequests();
    const index = requests.findIndex((r) => r.id.toLowerCase() === req.params.id.toLowerCase());

    if (index === -1) {
      return res.status(404).json({ message: `Request with ID ${req.params.id} not found.` });
    }

    const deletedRequest = requests.splice(index, 1)[0];
    await writeRequests(requests);

    res.status(200).json({
      message: 'Campus help request deleted successfully!',
      id: deletedRequest.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting request', error: error.message });
  }
});

// Start Express server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` ABES ENGINEERING COLLEGE - CAMPUS HELP DESK   `);
  console.log(` Server running at: http://localhost:${PORT}   `);
  console.log(`===============================================`);
});
