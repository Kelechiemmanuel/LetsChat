const express = require('express');
const app = express();
const cors = require('cors');

const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(cors({ origin: "*" }));
app.use(express.json());

/* ---------------- DATABASE ---------------- */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* ---------------- AUTH MIDDLEWARE ---------------- */
const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

/* ---------------- TEST ROUTE ---------------- */
app.get('/', (req, res) => {
  res.send("API is running 🚀");
});

/* ---------------- GET MESSAGES (PROTECTED) ---------------- */
app.get('/messages', authToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM messages");
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

/* ---------------- POST MESSAGE (PROTECTED) ---------------- */
app.post('/messages', authToken, async (req, res) => {
  const { content } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO messages (sender, content) VALUES ($1, $2) RETURNING *",
      [req.user.email, content]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to send message" });
  }
});

/* ---------------- REGISTER ---------------- */
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required'
    });
  }

  try {
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2)',
      [email, hashedPassword]
    );

    res.json({ message: 'User created' });

  } catch (error) {
    console.error("REGISTER ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/* ---------------- LOGIN ---------------- */
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credential' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });

  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});