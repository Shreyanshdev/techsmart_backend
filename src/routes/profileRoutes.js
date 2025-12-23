import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/profile.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.use(verifyToken);

router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

export default router;