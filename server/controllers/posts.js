import User from "../models/User.js";
import Post from "../models/Post.js";


/* Create */

export const createPost = async (req, res) => {
    try {

        const {userID, description, picturePath} = req.body;
        const user = await User.findByID(userID);
        const newPost = new Post({
            userID,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })
        await newPost.save();

        const post = await Post.find();
        res.status(201).json(post);
    } catch(err){
        res.status(409).json({message: err.message});
    }
}

/* Read */
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch(err){
        res.status(404).json({message: err.message});
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const {userID} = req.params;
        const post = await Post.find({userID});
        res.status(200).json(post);
    } catch(err){
        res.status(404).json({message: err.message});
    }
}

/* Update */
export const likePost = async (req, res) => {
    try {
        const {id} = req.params;
        const {userID} = req.body;
        const post = await Post.findByID(id);
        const isLiked = post.likes.get(userID);

        if (isLiked){
            post.likes.delete(userID);
        } else {
            post.likes.set(userID, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id, 
            {likes: post.likes},
            {new: true}
        );
        res.status(200).json(updatedPost);

    } catch(err){
        res.status(404).json({message: err.message});
    }
}