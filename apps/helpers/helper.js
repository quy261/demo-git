var bcrypt = require("bcrypt");

var config = require("config");

function hashPassword(passwd){
    var saltRounds = config.get("salt");

    var salt = bcrypt.genSaltSync(saltRounds);

    var hash = bcrypt.hashSync(passwd, salt);

    return hash;
}

function comparePassword(passwd, hash){
    return bcrypt.compareSync(passwd, hash);
}

module.exports = {
    hashPassword: hashPassword,
    comparePassword: comparePassword
}