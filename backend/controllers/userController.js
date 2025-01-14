import mongoose from "mongoose";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import User from "./../models/userModel.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import Post from "./../models/postModel.js";

export const getUserProfile = async (req, res) => {
  // either fetch user using username or id
  const { query } = req.params;

  try {
    let user;

    //quey is useid
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      //quey is username
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("get users error: " + error.message);
  }
};

export const getSuggestedUsers = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Fetch current user's following list
    const currentUser = await User.findById(userId).select("following");
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch up to 5 suggested users not followed by the current user
    const suggestedUsers = await User.find({
      _id: { $ne: userId, $nin: currentUser.following },
    })
      .select("-password -updatedAt")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.error("Error fetching suggested users:", error);
    res.status(500).json({ error: error.message });
  }
};

export const searchUser = async (req, res) => {
  const { term } = req.query;

  if (!term) {
    return res.status(400).json({ error: "Please provide a search term" });
  }

  try {
    const result = await User.aggregate([
      {
        $search: {
          index: "search",
          autocomplete: {
            query: term,
            path: "username",
            fuzzy: {
              maxEdits: 2,
              prefixLength: 0,
              maxExpansions: 50,
            },
          },
        },
      },
      {
        $limit: 5, // Correct usage of limit
      },
      {
        $project: {
          _id: 1,
          username: 1,
          name: 1,
          profilePic: 1,
          followers: { $size: "$followers" },
          following: { $size: "$following" },
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: error.message });
  }
};

export const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      res.status(200).json({
        _id: newUser._id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Failed to create user" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Signup error: " + error.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
    console.log("Login error: " + error.message);
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("logout error: " + error.message);
  }
};

export const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString())
      return res.status(400).json({ error: "You cannot follow yourself" });

    if (!userToModify || !currentUser)
      return res.status(404).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("follow unfollow error: " + error.message);
  }
};

export const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.params.id !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this user" });
    }

    // Handle image upload if there's a new file
    if (req.file) {
      try {
        // If user already has a profile picture, delete it from Cloudinary
        if (user.profilePic) {
          // Extract the public ID correctly
          const publicId = user.profilePic
            .split("/")
            .slice(-2) // Get the last two segments
            .join("/") // Join them back together
            .split(".")[0]; // Remove the file extension

          console.log("Attempting to delete image with public ID:", publicId);

          try {
            await cloudinary.uploader.destroy(publicId);
            console.log("Successfully deleted old image");
          } catch (deleteError) {
            console.error("Error deleting old image:", deleteError);
            // Continue with upload even if deletion fails
          }
        }

        // Convert buffer to base64
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        // Upload new image
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
          folder: "profile_pictures",
          resource_type: "auto",
          // Add unique identifier to prevent duplicate uploads
          public_id: `user_${userId}_${Date.now()}`,
        });

        user.profilePic = uploadResponse.secure_url;
        console.log("New image uploaded:", uploadResponse.secure_url);
      } catch (error) {
        console.error("Error handling image:", error);
        return res.status(500).json({ error: "Error uploading image" });
      }
    }

    // Update other fields
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;

    await user.save();

    //find all the posts that this user has replied and change the username and profile picture
    await Post.updateMany(
      { "replies.userId": userId },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].profilePic": user.profilePic,
        },
      },
      { arrayFilters: [{ "reply.userId": userId }] }
    );

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: error.message });
  }
};
