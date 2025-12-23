import express from "express";
import { addBranch, getBranches } from "../controllers/branch.js";
import { getNearestBranch } from "../controllers/subscription/helpers.js";

const router = express.Router();

router.post("/", addBranch);
router.get("/", getBranches);
router.get("/nearest", getNearestBranch);

export default router;
