const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")
const passport = require("passport")

// Post model
const post = require("../../models/Post")

// Profile model
const Profile = require("../../models/Profile")

// Validation
const validatePostInput = require("../../validation/post")

// @route   GET api/posts/posts
// @dsc     Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: "posts works"
}));

// @route   POST api/posts/
// @dsc     Get post
// @access  Public
router.get("/", (req, res) => {
    post.find().sort({
            date: -1
        }).then(post => res.json(post))
        .catch(err => res.status(404).json({
            nopostfound: 'No posts found'
        }))
})

// @route   POST api/posts/:id
// @dsc     Get post by id
// @access  Public
router.get("/:id", (req, res) => {
    post.findById(req.params.id).then(posts => res.json(posts))
        .catch(err => res.status(404).json({
            nopostfound: 'No post found with that ID'
        }))
})


// @route   POST api/posts/
// @dsc     Create post
// @access  Private
router.post("/", passport.authenticate("jwt", {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validatePostInput(req.body)

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors)
    }


    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post))
})

// @route   DELETE api/posts/:id
// @dsc     Delete a post
// @access  Public
router.delete("/:id", passport.authenticate("jwt", {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    // Check for post owner
                    if (post.user.toString() !== req.user.id) {
                        return res.status(401).json({
                            notauthorized: "User not authorized"
                        })
                    }

                    // Delete
                    post.remove().then(() => res.json({
                        success: true
                    }));
                })
                .catch(err => res.status(404).json({
                    postnotfound: "No post found"
                }))
        })
})

module.exports = router;