import express from "express";
import {createContest,getContests,getContestById,registerForContest,addProblemToContest,getContestProblems,getLeaderboard } from "../controllers/contestController";

import { authMiddleware, optionalAuthMiddleware } from "../middleware/authMiddleware";
import { authorizeRole } from "../middleware/roleMiddleware";

const router = express.Router();

router.post("/", authMiddleware, authorizeRole("ADMIN", "SETTER"),createContest );

router.get("/", getContests);
router.get("/:id", getContestById);

router.post("/:id/register", authMiddleware, registerForContest);

router.post("/:id/problems",authMiddleware, authorizeRole("ADMIN", "SETTER"), addProblemToContest );
router.get("/:id/problems", optionalAuthMiddleware,getContestProblems);

router.get("/:id/leaderboard", getLeaderboard);

export default router;