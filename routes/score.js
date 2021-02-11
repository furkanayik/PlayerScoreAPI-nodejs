const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { Validator } = require('node-input-validator');

router.post('/submit', async (req, res) => {
    const v = new Validator(req.body, {
        user_id: 'required',
        score_worth: 'required'
      });
    
      v.check().then((matched) => {
        if (!matched) {
          return res.status(422).send(v.errors);
        }
      }); //req.body validation

    let newScore = 0;
    let newRank = 0;
    let newScoreExists = 0;
    let oldScoreExists = 0;
    try {
        var getUser = await User.findOne({ user_id: req.body.user_id }, 'points'); //getUser
        newScore = Number(getUser.points) + Number(req.body.score_worth); //newScore
        newRank = await User.find({ points: { $gt: newScore } }, 'rank').sort({ rank: -1 }).limit(1).then(user => user[0].rank + 1); //newrank
        newScoreExists = await User.find({ points: { $eq: newScore } }).countDocuments(); //new score exists?
        oldScoreExists = await User.find({ points: { $eq: getUser.points } }).countDocuments(); //old score exists?
    } catch {
        return res.status(500).send({ error: "User couldn't found" });
    }

    try {
        await User.updateOne({ user_id: req.body.user_id }, { $set: { points: newScore, rank: newRank } }); //update score and rank
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }

    try {
        if (newScoreExists != 0 && oldScoreExists == 0) //if new scoreExists and oldScore doesn't exist rank change(-1) below old score
        {
            await User.updateMany({ points: { $lt: getUser.points } }, { $inc: { "rank": -1 } }); //gain rank by 1
        }
        else if (newScoreExists == 0 && oldScoreExists != 0) //if new score doesn't exists and oldScore exists rank change(+1) below new score
        {
            await User.updateMany({ points: { $lt: newScore } }, { $inc: { "rank": 1 } }); //lose rank by 1
        }
        else if (newScoreExists == 0 && oldScoreExists == 0) //if both new score and old score don't exist rank change(+1) between old-new score
        {
            await User.updateMany({ points: { $lt: newScore, $gt: getUser.points } }, { $inc: { "rank": 1 } }); //lose rank by 1
        }
        //if both new and old score exist no other rank change needed
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
    res.json({ "user_id": req.body.user_id, "score_worth": req.body.score_worth, "timestamp": Date.now() });
});

module.exports = router;