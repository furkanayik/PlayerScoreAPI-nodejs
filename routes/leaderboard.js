const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
    try {
        const users = await User.find({},'-_id -__v').sort('rank').lean();
        res.json(users);
    } catch (err) {
        res.status(404).send({ error: err.message });
    }
});

router.get('/:country', async (req, res) => {
    try {
        const users = await User.find({ country: req.params.country },'-_id -__v').sort('rank').lean();
        res.json(users);
    } catch (err) {
        res.status(404).send({ error: err.message });
    }
});


module.exports = router;