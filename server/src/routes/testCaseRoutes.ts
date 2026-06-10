import express from "express";

import {
  createTestCase,
  getTestCases,
} from "../controllers/testCaseController";

import { authMiddleware } from "../middleware/authMiddleware";
import { authorizeRole } from "../middleware/roleMiddleware";

const router = express.Router();

router.post("/:id/testcases",authMiddleware, authorizeRole("ADMIN", "SETTER","CONTESTANT"),createTestCase);
router.get("/:id/testcases",getTestCases);

export default router;