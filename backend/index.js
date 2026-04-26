const express = require('express');
const app = express();
const cors = require('cors');

const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


app.use(cors());
app.use(express.json());

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
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    }
})

app.get('/', (req, res) => {
    res.send('Hello Node js')
})

app.get('/messages', authToken, async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM messages");
        res.json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch messages" });
    } finally {
        client.release();
    }
});

app.post('/messages', authToken, async (req, res) => {
    const { content } = req.body;
    try {
        const result = await pool.query("INSERT INTO messages (sender, content) VALUES ($1, $2) RETURNING *", [req.user.email, content]);
        res.json(result.rows[0])
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Failed to send message'});

    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) return res.status(400).json({
            error: 'User not found'
        });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({
            error: 'Invalid credential'
        });

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.json({ token });

    } catch (error) {
        console.error("LOGIN ERROR:", error.message);
        res.status(500).json({
            error: error.message
        });
    }
});

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({
            error: 'Email and password are required'
        })
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
        res.json({ message: 'User created' });
    } catch (error) {
        console.error("REGISTER ERROR:", error.message);
        res.status(400).json({
            error: 'User already exist'
        });
    

    };
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);

});