const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());


const users = [];


app.post('/register', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    firstname,
    lastname,
    email,
    password: hashedPassword,
  };


  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).send('User already exists');
  }

  users.push(newUser);
  res.status(201).send('User registered successfully');
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(400).send('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).send('Invalid password');
  }

  const token = jwt.sign({ id: user.email }, 'your_jwt_secret');
  res.status(200).json({ token });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});









// const express = require("express")

// const app = express()


// app.get("/",(req,res)=>{
//     res.send("hi")
// })

// app.listen(8080,()=> console.log("Server running on PORT 8080"))