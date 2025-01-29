require('dotenv').config();
const express = require('express');
const { sequelize, User } = require('./models'); // Import Sequelize instance and User model
const bcryptjs = require('bcryptjs'); // Import bcryptjs for password hashing/comparison


const app = express();
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CORY Backend!' });
});

// Create a new user
app.post('/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create the user and hash the password (handled in the User model's hook)
    const user = await User.create({ username, email, password });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    const result = await User.destroy({ where: { id: req.params.id } });
    if (result) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user role (Admin or Organizer only)
app.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['organizer', 'volunteer', 'staff'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user rating (Organizers only)
app.put('/users/:id/rating', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ error: 'Invalid rating value. Must be between 0 and 5.' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.rating = rating;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Start server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});