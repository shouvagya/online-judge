import express from "express";
import {createProblem, getProblems, getProblemBySlug } from "../controllers/problemController";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorizeRole } from "../middleware/roleMiddleware";


const router = express.Router();

router.post("/",authMiddleware,authorizeRole("ADMIN", "SETTER"),createProblem);
router.get("/",getProblems);
router.get("/:slug",getProblemBySlug);

export default router;