import express from "express";
import {
  followUnFollowUser,
  getSuggestedUsers,
  getUserProfile,
  loginUser,
  logoutUser,
  searchUser,
  signupUser,
  updateUser,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";
import { handleFileUpload } from "./../middlewares/imageUpload.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.get("/search", searchUser);
router.get("/suggest/:userId", protectRoute, getSuggestedUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.put("/update/:id", protectRoute, handleFileUpload, updateUser);

export default router;
