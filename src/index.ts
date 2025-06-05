import "reflect-metadata";
import { connectDB } from "./config/db";
import { createApp } from "./app";

async function start() {
  try {
    await connectDB();
    const app = await createApp();
    app.listen(4000, () => {
      console.log("🚀 Server ready at http://localhost:4000/graphql");
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
  }
}

start();
