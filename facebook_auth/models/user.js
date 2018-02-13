var mongoose = require("mongoose");
var bcrypt   = require("bcrypt-nodejs")

var userSchema = mongoose.Schema({
    local: {
        email: String,
        password: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    }
})

//generate hash
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt, bcrypt.genSaltSync(8), null);
};

//check if password is valid
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model("User", userSchema);