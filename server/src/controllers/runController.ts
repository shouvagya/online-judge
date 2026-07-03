import { Response } from "express";

import { AuthRequest } from "../middleware/authMiddleware";

import { executeCppDocker } from "../services/executeCppDocker";
import { executeJavaDocker } from "../services/executeJavaDocker";
import { executePythonDocker } from "../services/executePythonDocker";

import { SUPPORTED_LANGUAGES } from "../constants/languages";

export const runCode = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      language,
      code,
      input,
    } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        message: "language and code are required",
      });
    }

    if (
      !SUPPORTED_LANGUAGES.includes(
        language.toLowerCase()
      )
    ) {
      return res.status(400).json({
        message: "Unsupported language",
      });
    }

    let result;

    switch (language.toLowerCase()) {
      case "cpp":
        result = await executeCppDocker(
          code,
          input ?? ""
        );
        break;

      case "java":
        result = await executeJavaDocker(
          code,
          input ?? ""
        );
        break;

      case "python":
        result = await executePythonDocker(
          code,
          input ?? ""
        );
        break;

      default:
        return res.status(400).json({
          message: "Unsupported language",
        });
    }

    res.json(result);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to execute code",
    });
  }
};