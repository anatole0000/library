// queues/redisConnection.ts
import { RedisOptions } from "bullmq";
import { Redis } from "ioredis";

// Tạo Redis connection cho BullMQ
export const connection: RedisOptions = {
  host: "127.0.0.1", // hoặc IP Redis server
  port: 6379,         // port Redis mặc định
};

// Nếu cần Redis instance riêng (ví dụ publish/subscribe)
export const redisClient = new Redis(connection);
