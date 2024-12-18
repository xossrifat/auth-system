const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

// Mock database
const users = [];
const licenses = [];
const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey";

// Register endpoint
app.post("/api/register", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).send({ message: "User registered successfully!" });
});

// Login endpoint
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
});

// Generate License endpoint
app.post("/api/generate-license", (req, res) => {
    const { adminToken, username } = req.body;
    try {
        const decoded = jwt.verify(adminToken, SECRET_KEY);
        if (decoded.username !== "admin") throw new Error("Unauthorized");

        const key = `KEY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        licenses.push({ key, username, status: "active" });
        res.json({ key });
    } catch (err) {
        res.status(403).send({ message: "Unauthorized" });
    }
});

// Validate License endpoint
app.post("/api/validate-license", (req, res) => {
    const { key } = req.body;
    const license = licenses.find((l) => l.key === key && l.status === "active");
    if (!license) {
        return res.status(400).send({ message: "Invalid or inactive license" });
    }
    res.send({ message: "License is valid" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
