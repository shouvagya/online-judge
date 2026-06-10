import express from "express";

import{ createSubmission, getSubmissionById, getMySubmissions } from "../controllers/submissionController";
import { authMiddleware } from "../middleware/authMiddleware";

const router= express.Router();

router.post("/",authMiddleware,createSubmission);
router.get("/me",authMiddleware,getMySubmissions);
router.get("/:id",authMiddleware,getSubmissionById);

export default router;