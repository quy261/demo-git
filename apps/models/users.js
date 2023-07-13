var q = require('q');

var db = require("../common/database");

var connection = db.getConnection();

// add new user into db
function addUser(user){
    if(user){
        var defer = q.defer();
        var query = connection.query('INSERT INTO users SET ?', user, function (error, results, fields) {
            if (error){
                defer.reject(error);
            }
            else{
                defer.resolve(results);
            }
        });

        return defer.promise;
    }
    
    return false;
}

// select email from db
function getUserByEmail(email) {
    if(email){
        var defer = q.defer();
        var query = connection.query('SELECT * FROM users WHERE ?', {email: email}, (error, results, fields) => {
            if (error){
                // console.log("Error");
                defer.reject(error);

            }
            else{
                // console.log(Results);
                defer.resolve(results);
            }
        });

        return defer.promise;
    }
    
    return false;
}

// get all users
function getAllUsers(){
    var defer = q.defer();
        var query = connection.query('SELECT * FROM users', function (error, results, fields) {
            if (error){
                defer.reject(error);
            }
            else{
                defer.resolve(results);
            }
        });

        return defer.promise;
}

module.exports = {
    addUser: addUser,
    getUserByEmail: getUserByEmail,
    getAllUsers: getAllUsers
}