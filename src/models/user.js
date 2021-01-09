// load the things we need
var { Schema, model } = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
// define the schema for our user model
var userSchema = Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    names: { type: String, required: true },
    surnames: { type: String, required: true },
}, {
    timestamps: true
});

// methods ======================
// generating a hash
userSchema.methods.encryptPasword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = model('users', userSchema);
//