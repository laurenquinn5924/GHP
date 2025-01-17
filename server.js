const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect DB
connectDB();

//Init middleware, should allow us to get the data from req.body
app.use(express.json({ extended: false }));

app.get('/', (req,res) => res.send('API Running, server.js') )

//Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/patients', require('./routes/api/patients'));
app.use('/api/product', require('./routes/api/product'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));