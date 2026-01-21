import express from "express";
import { addBranch, getBranches, getNearestBranch, getBranchByPincode, getDefaultBranch } from "../controllers/branch.js";

const router = express.Router();

router.post("/", addBranch);
router.get("/", getBranches);
router.get("/nearest", getNearestBranch);
router.get("/default", getDefaultBranch);
router.get("/pincode/:pincode", getBranchByPincode);

export default router;
