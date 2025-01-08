import User from "./../models/userModel.js";
import Post from "./../models/postModel.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {}
};

export const createPost = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    let { img } = req.body;

    if (!postedBy || !text) {
      return res.status(400).json({ error: "PostedBy and Text is required" });
    }

    const user = await User.findById(postedBy);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to create post" });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res.status(400).json({
        error: `Text must be less than ${maxLength} character`,
      });
    }

    let cloudinaryResponse = null;
    if (img) {
      cloudinaryResponse = await cloudinary.uploader.upload(img, {
        folder: "posts",
        resource_type: "auto",
      });
      img = {
        url: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id, // Store the public_id
      };
    }

    const newPost = new Post({
      postedBy,
      text,
      img: img
        ? {
            url: img.url,
            public_id: img.public_id,
          }
        : null,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log("Error creating post", error);
    // If image upload succeeded but post creation failed, delete the uploaded image
    if (error && img?.public_id) {
      try {
        await cloudinary.uploader.destroy(img.public_id);
      } catch (cloudinaryError) {
        console.log(
          "Error deleting image after failed post creation",
          cloudinaryError
        );
      }
    }
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "You are not authorized to delete this post",
      });
    }

    // Delete image from Cloudinary if it exists
    if (post.img && post.img.public_id) {
      try {
        await cloudinary.uploader.destroy(post.img.public_id);
      } catch (cloudinaryError) {
        console.log("Error deleting image from Cloudinary:", cloudinaryError);
        // Continue with post deletion even if image deletion fails
      }
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error deleting post", error);
    res.status(500).json({ error: error.message });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id.toString();

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const isAlreadyLiked = post.likes.includes(userId);
    if (isAlreadyLiked) {
      //unlike
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      //like
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.log("Error liking/unliking post", error);
    res.status(500).json({ error: error.message });
  }
};

export const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id.toString();
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) return res.status(400).json({ message: "Text is required" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const reply = { userId, userProfilePic, text, username };
    post.replies.push(reply);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log("Error replying to post", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteReplyFromPost = async (req, res) => {
  try {
    const { postId, replyId } = req.params;
    const userId = req.user._id.toString(); // Logged-in user ID

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const replyIndex = post.replies.findIndex(
      (reply) => reply._id.toString() === replyId
    );

    if (replyIndex === -1)
      return res.status(404).json({ message: "Reply not found" });

    const reply = post.replies[replyIndex];
    console.log("Reply userId:", reply.userId);
    console.log("Logged-in userId:", userId);

    // Authorization check
    if (reply.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this reply" });
    }

    post.replies.splice(replyIndex, 1);
    await post.save();

    res.status(200).json({ message: "Reply deleted successfully", post });
  } catch (error) {
    console.error("Error deleting reply:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getFeedPost = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    const following = user.following;

    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Error getting feed posts", error);
    res.status(500).json({ error: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  const { query } = req.params;
  try {
    let user;
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query });
    } else {
      user = await User.findOne({ username: query });
    }
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
