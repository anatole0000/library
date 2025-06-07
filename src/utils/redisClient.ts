import { createClient } from "redis";

export const redis = createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  }
});

redis.connect();
