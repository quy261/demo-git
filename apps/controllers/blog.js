var express = require("express");
var router = express.Router();
var post_md = require("../models/posts");

router.get("/", (req, res) => {
    // res.json({"message": "This is blog page"});
    let dataPostsPromise = post_md.getAllPosts();
    dataPostsPromise.then(function (posts) {
        let dataPosts = {
            posts: posts,
            error: false
        };
        res.render("blog/index", { data: dataPosts });
    })
    .catch(function (err) {
        res.render("blog/index", { data: { error: "Get Data Posts Process is failed..." } });
    });
    // res.render("blog/index.ejs");
});

router.get("/post/:id", (req, res) => {
    console.log(req.params.id);
    let data = post_md.getPostByID(req.params.id);
    data.then(function(posts){
        console.log(posts[0].title);
        let result ={
            post: posts[0],
            error: false
        };
        res.render("blog/post", {data: result});
    })
    .catch(function (err) {
        res.render("blog/post", { data: { error: "Get Data Post From ID failed..." } });
    });
})

router.get("/about", (req, res) => {
    res.render("blog/about");
})

module.exports = router;
