var mongoose = require('mongoose')

var Schema = mongoose.Schema
/*var UserSchema = new Schema({
    username: String,
    password: String,
    image: String
})

mongoose.model('User', UserSchema, 'User')*/

var UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String,
    image: String,
    type: String
})

mongoose.model('User', UserSchema, 'User')

