var mongoose = require('mongoose');

var Schema = mongoose.Schema;
/*var UserSchema = new Schema({
    username: String,
    password: String,
    image: String
})

mongoose.model('User', UserSchema, 'User')*/

var UserSchema = new Schema({
    username: { type: String, unique: true },
    firstname: String,
    lastname: String,
    password: String,
    image: String,
    type: String,
    email: String,
    address: String,
    city: String,
    country: String,
    postalcode: String,
    aboutme: String
});

mongoose.model('User', UserSchema, 'User');