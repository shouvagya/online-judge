import {prisma} from "../lib/prisma";

export const ContestService = {

  async createContest(data: any, userId: number) {
    return prisma.contest.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        createdById: userId,
      }
    });
  },


  async joinContest(contestId: number, userId: number) {
    return prisma.contestRegistration.create({
      data: {
        contestId,
        userId,
      }
    });
  },


  async getContest(contestId: number) {
    return prisma.contest.findUnique({
      where: { id: contestId },
      include: {
        contestProblems: {
          include: { problem: true }
        },
        contestRegistrations: true
      }
    });
  },

  

  async addProblem(contestId: number, problemId: number, points: number) {
    return prisma.contestProblem.create({
      data: {
        contestId,
        problemId,
        points
      }
    });
  }
};