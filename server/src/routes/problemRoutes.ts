import express from "express";
import {createProblem, getProblems, getProblemBySlug } from "../controllers/problemController";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/authMiddleware";
import { authorizeRole } from "../middleware/roleMiddleware";


const router = express.Router();

router.post("/",authMiddleware,authorizeRole("ADMIN", "SETTER","CONTESTANT"),createProblem);
router.get("/",optionalAuthMiddleware, getProblems);
router.get("/:slug",optionalAuthMiddleware, getProblemBySlug);

export default router;