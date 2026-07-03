import { Router } from "express";

import { runCode } from "../controllers/runController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  runCode
);

export default router;