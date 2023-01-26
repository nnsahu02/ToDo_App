const mongoose = require('mongoose')

//=========================// isValidName //=============================//
const isValidName = function (name) {
    if (/^[a-zA-Z ]+$/.test(name)) return true;
};

//=========================// isValidEmail //============================//
const isValidEmail = function (value) {
    let emailRegex =
        /^[a-z0-9_]{2,}@[a-z]{3,}.[com]{3}$/
    if (emailRegex.test(value)) return true;
};

//=========================// isValidObjectId //=========================//
const isValidId = function (value) {
    return mongoose.Types.ObjectId.isValid(value);
};

//=========================// isValidPassword //===========================//

const isValidPassword = function (pw) {
    let pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,15}$/;
    if (pass.test(pw)) return true;
};

//=========================// module exports //============================//

module.exports = { isValidName, isValidPassword, isValidEmail, isValidId }