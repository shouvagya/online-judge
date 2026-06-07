import { Request, Response } from "express";
import {prisma} from "../lib/prisma";

export const createTestCase = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {input, expectedOutput, isSample, orderIndex} = req.body;

    const testCase =
      await prisma.testCase.create({
        data: {
          problemId: Number(id),
          input,
          expectedOutput,
          isSample,
          orderIndex,
        },
      });

    res.status(201).json(testCase);
  } catch (error) {
        // console.log(error);
        res.status(500).json({
            error:error,
            message: "Failed to create test case",
        });
    }
};

export const getTestCases = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const testCases =
      await prisma.testCase.findMany({
        where: {
          problemId: Number(id),
        },
        orderBy: {
          orderIndex: "asc",
        },
      });

    res.json(testCases);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch test cases",
    });
  }
};