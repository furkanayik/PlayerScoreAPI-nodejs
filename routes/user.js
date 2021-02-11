const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { find, exists } = require('../models/User');
const router = express.Router();
const User = require('../models/User');
const { Validator } = require('node-input-validator');

router.post('/create', async (req, res) => {
    const v = new Validator(req.body, {
        display_name: 'required',
        country: 'required'
      });
    
      v.check().then((matched) => {
        if (!matched) {
          return res.status(422).send(v.errors);
        }
      }); //req.body validation
      
    const newRank = await User.find({ points: { $ne: 0 } }).countDocuments() + 1;
    const user = new User({
        user_id: uuidv4(),
        display_name: req.body.display_name,
        points: 0,
        rank: newRank,
        country: req.body.country
    });

    try {
        const savedUser = await user.save();
        res.json(savedUser.toJSON());
    } catch (err) {
        res.json({ message: err.message });
    }
});

router.get('/profile/:userId', async (req, res) => {
    try {
        const user = await User.find({ user_id: req.params.userId },'-_id -__v').lean();
        res.json(user);
    } catch (err) {
        res.status(404).send({ error: err.message });
    }
});

router.post('/generate', async (req, res) => {
    const v = new Validator(req.body, {
        user_count: 'required'
      });
    
      v.check().then((matched) => {
        if (!matched) {
          return res.status(422).send(v.errors);
        }
      }); //req.body validation

    var countries = ["tr", "us", "gb", "al", "ar", "az", "be", "bg", "ca", "hr", "de", "it", "no", "es", "se", "ch"];
    var randomCountry;
    var rndmPoints;
    var count = 0;
    var newRank;
    var isPointExists;
    //res.json({ message: "Generating process has begun" });

    for (var i = 0; i < req.body.user_count; i++) {
        res.json({ message: "Generating process has begun" });
        console.log(req.body.user_count);
        randomCountry = countries[Math.floor(Math.random() * 16)]; //random country
        rndmPoints = Math.floor(Math.random() * 99000) + 1000; //random points between 1000 and 100000        
        try {
            newRank = await User.find({ points: { $gt: rndmPoints } }, 'rank').sort({ rank: -1 }).limit(1).then(user => user[0].rank + 1); //calc rank
        } catch {//if there is no bigger points
            newRank = 1;
        }
        const user = new User({
            user_id: uuidv4(),
            display_name: Math.random().toString(36).substring(4), //random username
            points: rndmPoints,
            rank: newRank,
            country: randomCountry
        });
        try {
            isPointExists = await User.find({ points: { $eq: rndmPoints } }).countDocuments(); //same point exists?
            await user.save();
            if (isPointExists == 0) //if point doesn't exists, update below ranks
            {
                await User.updateMany({ points: { $lt: rndmPoints } }, { $inc: { "rank": 1 } }); //increase ranks below this point by one
            }
        } catch {
            continue;
        }
        count = count + 1;
    }    
});


router.post('/delete/generate', async (req, res) => {
    const v = new Validator(req.body, {
        user_count: 'required'
      });
    
      v.check().then((matched) => {
        if (!matched) {
          return res.status(422).send(v.errors);
        }
      }); //req.body validation
      
    var countries = ["tr", "us", "gb", "al", "ar", "az", "be", "bg", "ca", "hr", "de", "it", "no", "es", "se", "ch"];
    var newPoint = Math.floor(Math.random() * 10) + 149985; //random points between 150000 and 149985
    var newRank = 1;
    var arr = [];
    var count = 0;

    if (req.body.user_count > 15000) {
        return res.json({ message: count + "can't generate more then 15000 users" });
    } else {        
        try {
            await User.deleteMany(); //delete all
        } catch (err) {
            return res.json({ message: err.message });
        }

        for (var i = 0; i < req.body.user_count; i++) {
            var obj = {
                "user_id": uuidv4(),
                "display_name": Math.random().toString(36).substring(4), //random display name
                "points": newPoint,
                "rank": newRank,
                "country": countries[Math.floor(Math.random() * 16)] //random country
            };
            arr.push(obj);
            count = count + 1;

            if (Math.floor(Math.random() * 10) == 5) {
                continue; // add some equal points
            } else if (newPoint == 0) {
                continue; //keep adding with 0 points, same rank
            }

            newPoint = newPoint - 10; //reduce point
            newRank = newRank + 1; //inc rank
        }
        try {
            await User.insertMany(arr); //insert all
        } catch (err) {
            return res.json({ message: err.message });
        }
        res.json({ message: count + "users have been created" });
    }
});

router.delete('/delete', async (req, res) => {
    try {
        await User.deleteMany({});
        res.json({ message: "All users have been deleted!" });
    } catch (err) {
        res.json({ message: err.message });
    }
});


module.exports = router;