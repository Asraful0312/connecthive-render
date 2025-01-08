import express from "express";
import {
  createPost,
  deletePost,
  deleteReplyFromPost,
  getFeedPost,
  getPost,
  getUserPosts,
  likeUnlikePost,
  replyToPost,
} from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPost);
router.get("/:id", getPost);
router.get("/user/:query", getUserPosts);
router.post("/create", protectRoute, createPost);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);
router.delete("/reply/:postId/:replyId", protectRoute, deleteReplyFromPost);

export default router;
