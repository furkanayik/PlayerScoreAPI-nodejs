const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        index: true
    },
    display_name: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    rank: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true,
        index: true
    }
});

UserSchema.index({ rank: -1 });

UserSchema.set('toJSON', { //not to show mongoose default _id and _v
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('User', UserSchema);