import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  toggleWishlist,
  getWishlist
} from "../controllers/profile.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);

router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

router.get("/wishlist", getWishlist);
router.post("/wishlist", toggleWishlist);

export default router;