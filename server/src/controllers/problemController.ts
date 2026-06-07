import { Response } from "express";
import {prisma} from "../lib/prisma";
import { AuthRequest } from "../middleware/authMiddleware";

export const createProblem = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      title,
      slug,
      description,
      difficulty,
      tags,
    } = req.body;

    if(!title || !slug || !description || !difficulty){
        return res.status(400).json({
            message:"Missing required fields",
        });
    }

    const problem = await prisma.problem.create({
      data: {
        title,
        slug,
        description,
        difficulty,
        tags,
        authorId: req.user!.userId,
      },
    });

    res.status(201).json(problem);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create problem",
    });
  }
};

export const getProblems = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const problems = await prisma.problem.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        tags: true,
      },
    });

    res.json(problems);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch problems",
    });
  }
};

export const getProblemBySlug = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { slug } = req.params;

    const problem = await prisma.problem.findUnique({
        where: {
            slug,
        },
        include: {
            author: {
                select: {
                    id: true,
                    username: true,
                },
            },

            testCases: {
                where: {
                    isSample: true,
                },

                orderBy: {
                    orderIndex: "asc",
                },

                select: {
                    input: true,
                    expectedOutput: true,
                    orderIndex: true,
                },
            },
        },
    });

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    res.json(problem);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch problem",
    });
  }
};