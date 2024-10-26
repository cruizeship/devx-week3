const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const nodemailer = require('nodemailer');
const mysql = require('mysql2');

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))

const route = express.Router()
const port = process.env.PORT || 5001;

app.use('/v1', route);
app.listen(port, () => {
  console.log('server listening on port ' + port)
})

route.get('/simple-get', (req, res) => {
  res.send("ajfk;ladsjf;lkdasjf lka;dsjfkl; asdfj")
})

route.get('/dynamic-get', (req, res) => {
  res.send(req.body.inputString)
})

route.get('/pokemon/:name', async (req, res) => {
  const pokemonName = req.params.name.toLowerCase();
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const pokemonData = {
      name: response.data.name,
      id: response.data.id,
      height: response.data.height,
      weight: response.data.weight,
    };
    res.json(pokemonData)
  } catch (error) {
    
  }
})

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
      user: 'ucladevxtest@gmail.com',
      pass: 'pwek lyup fzqt qtji'
  },
  secure: true,
});

route.post('/send-email', (req, res) => {
  const {to, subject, text} = req.body
  const mailData = {
    from: 'ucladevxtest@gmail.com',
    to: to,
    subject: subject,
    text: text,
    html: '<p>' + text + '<p>',
  }

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      return console.log(error);
    }
    res.status(200).send({ message: "Mail send", message_id: info.messageId });
  })
})

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'devx',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the MySQL database.');
  }
});

route.post('/add-user', (req, res) => {
  const { email, password } = req.body;

  const query = 'INSERT INTO users (user_email, user_password) VALUES (?, ?)';
  
  db.query(query, [email, password], (err, result) => {
    if (err) {
      return res.status(500).send('Error adding user to the database.');
    }
    res.status(200).send('User added successfully.');
  });
});

route.post('/verify-user', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE user_email = ? AND user_password = ?';
  
  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).send('Error verifying user credentials.');
    }

    if (results.length > 0) {
      res.status(200).send('User verified successfully.');
    } else {
      res.status(401).send('Invalid email or password.');
    }
  });
});
