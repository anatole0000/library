import jwt from "jsonwebtoken";
import Koa from "koa";

const JWT_SECRET = "your_jwt_secret_key_here";

export async function authMiddleware(ctx: Koa.Context, next: Koa.Next) {
  const authHeader = ctx.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      ctx.state.user = payload; // Lưu thông tin user vào ctx.state
    } catch (err) {
      console.error("JWT verification error:", err);
      ctx.status = 401;
      ctx.body = { error: "Invalid token", details: err instanceof Error ? err.message : String(err) };
      return;
    }
  }
  await next();
}
