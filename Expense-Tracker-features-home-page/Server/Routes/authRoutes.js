// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hellosafarnamaaa@gmail.com',
    pass: 'kqprukrejhmikmbi',
  },
});

router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: 'Please add the fields.' });
  }

  pool.query('SELECT * FROM users WHERE email = $1', [email], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (result.rows.length > 0) {
      return res.status(422).json({ error: 'User already exists.' });
    }

    bcrypt.hash(password, 12, (err, hashedpassword) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, hashedpassword],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          const user = result.rows[0];
          transporter.sendMail({
            from: 'hellosafarnamaaa@gmail.com',
            to: user.email,
            subject: 'Signup Successfully ',
            html: '<h1>Welcome to Safarnamaaa!!!</h1>',
          });
          res.json({ message: 'Saved Successfully.' });
        }
      );
    });
  });
});

router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: 'Please provide both email and password' });
  }

  pool.query('SELECT * FROM users WHERE email = $1', [email], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const savedUser = result.rows[0];
    if (!savedUser) {
      return res.status(422).json({ error: 'Invalid email or password' });
    }

    bcrypt.compare(password, savedUser.password, (err, doMatch) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (doMatch) {
        const token = jwt.sign({ _id: savedUser.id }, JWT_SECRET);
        const { id, name, email } = savedUser;
        res.json({ token, user: { id, name, email } });
      } else {
        return res.status(422).json({ error: 'Invalid email or password' });
      }
    });
  });
});

// Routes for reset-password and new-password...

module.exports = router;
