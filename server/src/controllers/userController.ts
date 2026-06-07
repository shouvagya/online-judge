import { Response } from "express";
import {prisma} from "../lib/prisma";

import { AuthRequest} from "../middleware/authMiddleware";


export const getMe = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user!.userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        rating: true,
        createdAt: true,
      },
    });

    res.json(user);

  } catch (error) {
    res.status(500).json({
        error:error,
        message: "Failed to fetch profile",
    });
  }
};