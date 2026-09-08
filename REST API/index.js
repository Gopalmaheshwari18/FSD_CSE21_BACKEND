import express from 'express';

const app = express();

// Middleware to read JSON data
app.use(express.json());

let users = [
    { id: 1, name: "app", email: "appbirla181@gmail.com" },
    { id: 2, name: "Devu", email: "devubirla181@gmail.com" }
];

// GET: Fetch all users
app.get('/users', (req, res) => {
    res.json(users);
});

// POST: Create a new user
app.post('/users', (req, res) => {
    let user = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email
    };

    users.push(user);
    res.json(user);
});

// PUT: Update a user
app.put('/users/:id', (req, res) => {
    let user = users.find(u => u.id == req.params.id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name;
    user.email = req.body.email;

    res.json(user);
});

// DELETE: Delete a user
app.delete('/users/:id', (req, res) => {
    users = users.filter(u => u.id != req.params.id);

    res.send("User deleted successfully");
});

// Start server
app.listen(8000, () => {
    console.log("Server is running on http://localhost:8000");
});