import { Response } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/authMiddleware";

export const createContest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      scoringType,
      isPublic,
    } = req.body;

    if (!title || !description || !startTime || !endTime) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        message: "Invalid startTime or endTime",
      });
    }

    if(start<= new Date()){
      return res.status(400).json({
        message:"Contest must start in the future",
      })
    }

    if (end <= start) {
      return res.status(400).json({
        message: "endTime must be after startTime",
      });
    }

    const contest = await prisma.contest.create({
      data: {
        title,
        description,
        startTime: start,
        endTime: end,
        scoringType: scoringType || "IOI",
        isPublic: isPublic ?? true,
        createdById: req.user!.userId,
      },
    });

    res.status(201).json(contest);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create contest",
    });
  }
};

export const getContests = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const contests = await prisma.contest.findMany({
      select: {
        id: true,
        title: true,
        startTime: true,
        endTime: true,
        status: true,
        scoringType: true,
        isPublic: true,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    res.json(contests);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch contests",
    });
  }
};

export const getContestById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const isPrivileged =
      req.user?.role === "ADMIN" || req.user?.role === "SETTER";

    const contest = await prisma.contest.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
          },
        },
        contestProblems: {
          orderBy: {
            orderIndex: "asc",
          },
          include: {
            problem: {
              select: {
                id: true,
                title: true,
                slug: true,
                difficulty: true,
              },
            },
          },
        },
      },
    });

    if (!contest) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    const hasNotStarted = new Date() < contest.startTime;

    if (hasNotStarted && !isPrivileged) {
      // Don't leak problem identities before the contest opens -
      // everything else about the contest (title, timing, etc.) is
      // fine to show.
      const { contestProblems, ...contestResponse } = contest;
      return res.json({
        ...contestResponse,
        contestProblems: [],
      });
    }

    res.json(contest);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch contest",
    });
  }
};

export const registerForContest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const contestId = Number(id);

    const contest = await prisma.contest.findUnique({
      where: {
        id: contestId,
      },
    });

    if (!contest) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    if (contest.status === "ENDED") {
      return res.status(400).json({
        message: "Cannot register for a contest that has ended",
      });
    }

    const existing = await prisma.contestRegistration.findUnique({
      where: {
        contestId_userId: {
          contestId,
          userId: req.user!.userId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "Already registered for this contest",
      });
    }

    const registration = await prisma.contestRegistration.create({
      data: {
        contestId,
        userId: req.user!.userId,
      },
    });

    res.status(201).json(registration);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to register for contest",
    });
  }
};

export const addProblemToContest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { problemId, points, orderIndex } = req.body;
    const contestId = Number(id);

    if (!problemId) {
      return res.status(400).json({
        message: "problemId is required",
      });
    }

    const contest = await prisma.contest.findUnique({
      where: {
        id: contestId,
      },
    });

    if (!contest) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    const problem = await prisma.problem.findUnique({
      where: {
        id: Number(problemId),
      },
    });

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    const existing = await prisma.contestProblem.findUnique({
      where:{
        contestId_problemId:({
          contestId,
          problemId:Number(problemId)
        })
      }
    });

    if(existing){
      return res.status(400).json({
        message:"Problem already added",
      })
    }

    const contestProblem = await prisma.contestProblem.create({
      data: {
        contestId,
        problemId: Number(problemId),
        points: points ?? 100,
        orderIndex: orderIndex ?? 0,
      },
    });

    res.status(201).json(contestProblem);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to add problem to contest",
    });
  }
};

export const getContestProblems = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const contestId = Number(id);

    const isPrivileged =
      req.user?.role === "ADMIN" || req.user?.role === "SETTER";

    const contest = await prisma.contest.findUnique({
      where: {
        id: contestId,
      },
    });

    if (!contest) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    if (new Date() < contest.startTime && !isPrivileged) {
      return res.json([]);
    }

    const contestProblems = await prisma.contestProblem.findMany({
      where: {
        contestId,
      },
      orderBy: {
        orderIndex: "asc",
      },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
          },
        },
      },
    });

    res.json(contestProblems);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch contest problems",
    });
  }
};

// Simple IOI-style leaderboard: for each contestant, sum their best
// (highest) score per problem; rank by total score descending.
// Computed on read - no realtime push, just a plain GET.
export const getLeaderboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const contestId = Number(id);

    const contest = await prisma.contest.findUnique({
      where: {
        id: contestId,
      },
    });

    if (!contest) {
      return res.status(404).json({
        message: "Contest not found",
      });
    }

    const contestProblems = await prisma.contestProblem.findMany({
      where: {
        contestId,
      },
      select: {
        problemId: true,
        points: true,
      },
    });

    const pointsByProblem = new Map<number, number>(
      contestProblems.map((cp) => [cp.problemId, cp.points])
    );

    const registrations = await prisma.contestRegistration.findMany({
      where: {
        contestId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    const submissions = await prisma.submission.findMany({
      where: {
        contestId,
        status: "ACCEPTED",
      },
      select: {
        userId: true,
        problemId: true,
      },
    });

    // Best score per (user, problem)
    const bestScore = new Map<string, number>();

    for (const sub of submissions) {
      const key = `${sub.userId}:${sub.problemId}`;
      const points = pointsByProblem.get(sub.problemId) ?? 0;

      bestScore.set(
        key,
        Math.max(bestScore.get(key) ?? 0, points)
      );
    }

    const leaderboard = registrations.map((reg) => {
      let totalScore = 0;
      let solvedCount = 0;

      for (const problemId of pointsByProblem.keys()) {
        const score = bestScore.get(`${reg.userId}:${problemId}`) ?? 0;

        if (score > 0) {
          totalScore += score;
          solvedCount++;
        }
      }

      return {
        userId: reg.userId,
        username: reg.user.username,
        totalScore,
        solvedCount,
      };
    });

    // Sort by:
    // 1. Total score (desc)
    // 2. Solved count (desc)
    // 3. Username (asc) for deterministic ordering
    leaderboard.sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }

      if (b.solvedCount !== a.solvedCount) {
        return b.solvedCount - a.solvedCount;
      }

      return a.username.localeCompare(b.username);
    });

    // Competition ranking
    // Example:
    // 500 -> Rank 1
    // 500 -> Rank 1
    // 400 -> Rank 3
    const ranked = [];

    let currentRank = 1;

    for (let i = 0; i < leaderboard.length; i++) {
      if (
        i > 0 &&
        (
          leaderboard[i].totalScore !== leaderboard[i - 1].totalScore ||
          leaderboard[i].solvedCount !== leaderboard[i - 1].solvedCount
        )
      ) {
        currentRank = i + 1;
      }

      ranked.push({
        rank: currentRank,
        ...leaderboard[i],
      });
    }

    res.json(ranked);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch leaderboard",
    });
  }
};