const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const SECRET = "parking_secret";

app.post("/api/auth/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  users.push({ email: req.body.email, password: hashed });
  res.json({ message: "Registration successful" });
});

app.post("/api/auth/login", async (req, res) => {
  const user = users.find(u => u.email === req.body.email);
  if (!user) return res.json({ message: "User not found" });

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.json({ message: "Wrong password" });

  const token = jwt.sign({ email: user.email }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

app.get("/api/auth/google", (req, res) => {
  res.send("Google OAuth setup here (Passport.js)");
});

app.listen(5000, () => console.log("Server running"));
