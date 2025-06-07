// src/queues/loanStatsQueue.ts
import { Queue } from "bullmq";
import { connection } from "./redisConnection";

export const loanStatsQueue = new Queue("loan-stats-queue", { connection });
