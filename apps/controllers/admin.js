var express = require("express");
var router = express.Router();

var user_md = require("../models/users");
var post_md = require("../models/posts");
var helper = require("../helpers/helper");

//admin
router.get("/", (req, res) => {
    if (req.session.user) {
        let dataPostsPromise = post_md.getAllPosts();
        dataPostsPromise.then(function (posts) {
            let dataPosts = {
                posts: posts,
                error: false
            };
            res.render("admin/dashboard", { data: dataPosts });
        })
            .catch(function (err) {
                res.render("admin/dashboard", { data: { error: "Get Data Posts Process is failed..." } });
            });
    } else {
        res.redirect("/admin/signin");
    }
});

// posts
router.get("/posts", (req, res) => {
    if (req.session.user) {
        res.redirect("/admin");
    } else {
        res.redirect("admin/signin");
    }
})

// users
router.get("/users", (req, res) => {
    if (req.session.user) {
        let data = user_md.getAllUsers();
        data.then(function (users) {
            let data = {
                users: users,
                error: false
            }
            res.render("admin/users", { data: data });
        })
            .catch(function (err) {
                let data = {
                    error: "Could not get users info"
                }
                res.render("admin/users", { data: data });
            })
    } else {
        res.redirect("/admin/signin");
    }
})

// signUp
router.get("/signup", (req, res) => {
    res.render("signup", { data: {} });
})

router.post("/signup", (req, res, data) => {
    var user = req.body;
    // check email
    if (user.email.trim().length == 0) {
        res.status(400).json({ message: "A blank email is not allowed" });
        res.render("signup", { data: { "error": "Email is required" } });
    }
    // check identical password
    if (user.repasswd != user.passwd || user.passwd.trim().length == 0) {
        res.status(400).json({ message: "Password is not match" });
        res.render("signup", { data: { "error": "Password is not match" } });
    }
    // format user
    var password = helper.hashPassword(user.passwd);
    var now = new Date().toLocaleString('vi-VN');
    user = {
        email: user.email,
        password: password,
        first_name: user.fname,
        last_name: user.lname,
        created_at: now,
        updated_at: now
    }

    // insert to db
    var result = user_md.addUser(user);

    result.then(function (data) {
        // res.status(200);
        res.redirect("/admin/signin");
    })
        .catch(function (err) {
            console.log(err);
            res.status(500).json({ message: "Could not insert to database" })
            res.render("signup", { data: { "error": "Could not insert user to db" } });
        })

})

// signIn
router.get("/signin", (req, res) => {
    res.render("signin", { data: {} });
})

// POST method for SignIn
router.post("/signin", (req, res) => {
    let params = req.body;
    // console.log(param);

    // check email is null
    if (params.email.trim().length == 0) {
        // res.status(400).json({message: "A blank email is not allowed"});
        res.render("signin", { data: { "error": "Please enter an email" } });
    }
    else {
        let dataUserPromise = user_md.getUserByEmail(params.email);
        if (dataUserPromise) {
            dataUserPromise.then(function (users) {
                // console.log(users);
                if (users.length) {
                    let user = users[0];
                    let status = helper.comparePassword(params.passwd, user.password);
                    // check passwd is wrong
                    if (!status) {
                        // res.status(400).json({message: "Password is incorrect"});
                        res.render("signin", { data: { "error": "Password is incorrect. Please try again!!!" } });
                    }
                    else {
                        req.session.user = user;
                        // res.status(200).json({data: user});
                        res.redirect("/admin");
                    }
                }
                // check email not exist
                else {
                    // res.status(404).json({message: "Email is invalid or not exist"})
                    res.render("signin", { data: { "error": "Email is invalid or not exist. Please try again!!!" } });
                }
            });
        }
        // check error in logging process
        else {
            // res.status(500).json({message: "Have an error in LOGGING IN process. Please try again!!!"})
            res.render("signin", { data: { "error": "Have an error in LOGGING IN process. Please try again!!!" } });
        }
    }
})

// add new post
router.get("/posts/new", (req, res) => {
    if (req.session.user) {
        res.render("admin/posts/new", { data: { error: false } });
    }
    else {
        res.redirect("/admin/signin");
    }
})

router.post("/posts/new", (req, res) => {
    var dataPost = req.body;
    // console.log(dataPost);

    // check title is null
    if (dataPost.title.trim().length == 0) {
        res.render("admin/posts/new", { data: { "error": "Please fill in the title. Don't leave it blank!!!" } });
    }

    // check content is null
    // else if(dataPost.content.trim().length == 0){
    //     dataPost.content = "<-- no content -->"
    // }

    // check author is null
    // else if(dataPost.author.trim().length == 0){
    //     dataPost.author = "<-- Anonymous -->"
    // }

    else {
        let now = new Date();
        dataPost.created_at = now;
        dataPost.updated_at = now;
        // console.log(dataPost);
        let dataPro = post_md.addPost(dataPost);

        dataPro.then(function (result) {

            res.redirect("/admin");
            // res.json({"message": "Insert user successfully"});
        })
            .catch(function (err) {
                console.log(err);
                res.render("admin/posts/new", { data: { "error": "Could not insert user to db" } });
            })
    }
})

// GET method for edit
router.get("/post/edit/:id", function (req, res) {
    if (req.session.user) {
        let params = req.params;
        let id = params.id;
        let data = post_md.getPostByID(id);
        if (data) {
            data.then(function (posts) {
                let post = posts[0];
                let dataEdit = {
                    post: post,
                    error: false
                }
                res.render("admin/posts/edit", { data: dataEdit });
            }).catch(function (err) {
                let dateError = {
                    error: "Could not get this post for Edit"
                }
                res.render("admin/posts/edit", { data: dataError });
            });
        }
        else {
            let dateError = {
                error: "Could not get this post from DB"
            }
            res.render("admin/posts/edit", { data: dataError });
        }
    } else {
        res.redirect("/admin/signin");
    }
});

// PUT method for edit
router.put("/post/edit", function (req, res) {

    let params = req.body;
    // console.log(params);
    let data = post_md.updatePost(params);
    if (!data) {
        res.json({ status_code: 500 });
    }
    else {
        data.then(function (result) {
            res.json({ status_code: 200 });
        }).catch(function (err) {
            res.json({ status_code: 500 });
        })
    }
})

// DELETE method
router.delete("/post/delete", function (req, res) {
    let post_id = req.body.id;
    let data = post_md.deletePost(post_id);
    if (!data) {
        res.json({ status_code: 500 });
    }
    else {
        data.then(function (result) {
            res.json({ status_code: 200 });
        })
            .catch(function (err) {
                res.json({ status_code: 500 });
            })
    }
})

module.exports = router;
