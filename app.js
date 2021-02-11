const express = require('express'); //import express
const app = express(); //execute
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

app.use(bodyParser.json());

//listen to this port
app.listen(process.env.PORT || 5000);


//routes
const userRoute = require('./routes/user');
const scoreRoute = require('./routes/score');
const leaderBoardRoute = require('./routes/leaderboard');
app.use('/user', userRoute);
app.use('/score', scoreRoute);
app.use('/leaderboard', leaderBoardRoute);

app.get('/', async (req, res) => {
    res.json({ message: "Welcome to PlayerScoreAPI" });
});

mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true }, () => {
        console.log('connceted to db!')
    });
