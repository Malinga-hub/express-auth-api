const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const phoneRegex = /[0-9]+/

const userSchema = mongoose.Schema({
    "fullname": {type: String, required: [true, 'fullname field is required']},
    "email": {type:String, required: [true, 'Email field must be valid and is required'], unique: true, match: [emailRegex, "Invalid email address"]},
    "phone": {type: String, required: ['phone field is required'], match: [phoneRegex, 'Invalid phone number'], minlength: [8, 'invalid phone number']},
    "gender": {type: String, required: ['gender field is required'], minlength: [1, 'invalid gender']},
    "password": {type: String, required: [true, 'password field is required'], minlength: [5, 'password must be greater than 5 charecters']},
    "createdAt": {type: Date, default: Date.now}
})

/* encrypt password */
userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

/* export schema */
module.exports = mongoose.model('User', userSchema)