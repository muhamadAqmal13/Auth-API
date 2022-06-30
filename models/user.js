const { Schema, default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const User = new Schema(
    {
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: true
        },
        username: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
            min: 6,
            max: 15
        },
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            min: 8
        },
        refresh_token: {
            type: String
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

User.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    bcrypt.hash(this.password, 10, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
});
module.exports = mongoose.model('User', User);
