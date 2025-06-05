"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "your_jwt_secret_key_here";
async function authMiddleware(ctx, next) {
    const authHeader = ctx.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            ctx.state.user = payload; // Lưu thông tin user vào ctx.state
        }
        catch (err) {
            console.error("JWT verification error:", err);
            ctx.status = 401;
            ctx.body = { error: "Invalid token", details: err instanceof Error ? err.message : String(err) };
            return;
        }
    }
    await next();
}
