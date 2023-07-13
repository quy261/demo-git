var q = require('q');

var db = require("../common/database");

var connection = db.getConnection();

function getAllPosts(){
    var defer = q.defer();
    var query = connection.query('SELECT * FROM posts ', function (error, posts, fields) {
        if (error){
            defer.reject(error);
        }
        else{
            defer.resolve(posts);
        }
    });

    return defer.promise;
};

function addPost(params){
    if(params){
        var defer = q.defer();
        var query = connection.query('INSERT INTO posts SET ?', params, function (error, results, fields) {
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
};

function getPostByID(id){
    var defer = q.defer();
    var query = connection.query('SELECT * FROM posts WHERE ?',{id: id}, function (error, posts, fields) {
        if (error){
            defer.reject(error);
        }
        else{
            defer.resolve(posts);
        }
    });

    return defer.promise;
};

function updatePost(params){
    if(params){
        let defer = q.defer();
        let query = connection.query('UPDATE posts SET title = ?, content = ?, author = ?, updated_at = ? WHERE id = ?', [params.title, params.content, params.author, new Date().toLocaleString('vi-VN'), params.id], function (error, results, fields) {
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

function deletePost(id){
    if(id){
        var defer = q.defer();
        var query = connection.query('DELETE FROM posts WHERE id = ?',[id], function (error, posts, fields) {
            if (error){
                defer.reject(error);
            }
            else{
                defer.resolve(posts);
            }
        });

        return defer.promise;
    }
    return false;
}
module.exports = {
    getAllPosts: getAllPosts,
    addPost: addPost,
    getPostByID: getPostByID,
    updatePost: updatePost,
    deletePost: deletePost
}