const validator = require("validator");
const mongoose = require("mongoose");

let userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {
            type: String,
            required: true,
            lowercase: true,
            validate: (value)=>{
                 return validator.isEmail(value)
            }
        },
        mobile: {type: String, default: "000-000-0000"},
        password: {type: String, required: true},
        role: {type: String, required: true},
        createAt: {type: Date, default: Date.now}
    },
    {
        collection: 'users',
        versionKey: false
    }
);

let userModel = mongoose.model('user', userSchema)
module.exports = {userModel}