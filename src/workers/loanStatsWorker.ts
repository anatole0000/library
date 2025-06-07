// src/workers/loanStatsWorker.ts
import { Worker } from "bullmq";
import { connection } from "../queues/redisConnection";
import { createClient } from "redis";

// Redis client để lưu cache thống kê
const redis = createClient();

export const loanStatsWorker = new Worker(
  "loan-stats-queue",
  async (job) => {
    if (!redis.isOpen) {
      await redis.connect();
    }
    const { type: _type, bookId, bookTitle: _bookTitle, borrowDate } = job.data;
    const date = new Date(borrowDate);
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-based

    const monthlyKey = `monthlyStats:${year}`;
    const bookKey = `topBooks`;

    // Lấy thống kê hiện tại từ Redis (hoặc tạo mới)
    const monthlyRaw = await redis.get(monthlyKey);
    const monthly = monthlyRaw ? JSON.parse(monthlyRaw) : Array(12).fill(0);
    monthly[month] += 1;
    await redis.set(monthlyKey, JSON.stringify(monthly));

    const bookRaw = await redis.get(bookKey);
    const books = bookRaw ? JSON.parse(bookRaw) : {};
    books[bookId] = (books[bookId] || 0) + 1;
    await redis.set(bookKey, JSON.stringify(books));
  },
  { connection }
);
