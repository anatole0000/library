// workers/emailWorker.ts
import { Worker } from "bullmq";
import { sendEmail } from "../utils/mailer";
import { connection } from "../queues/redisConnection";

export const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    const { to, subject, html } = job.data;
    await sendEmail(to, subject, html);
  },
  { connection }
);
