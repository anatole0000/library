"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const apollo_server_koa_1 = require("apollo-server-koa");
const schema_1 = require("./graphql/schema");
const resolvers_1 = require("./graphql/resolvers");
const authMiddleware_1 = require("./middleware/authMiddleware");
const createApp = async () => {
    const app = new koa_1.default();
    const router = new koa_router_1.default();
    // Đăng ký middleware xác thực token JWT
    app.use(authMiddleware_1.authMiddleware);
    // Khởi tạo ApolloServer, truyền context để lấy thông tin user từ ctx.state
    const server = new apollo_server_koa_1.ApolloServer({
        typeDefs: schema_1.typeDefs,
        resolvers: resolvers_1.resolvers,
        context: ({ ctx }) => {
            return { user: ctx.state.user };
        },
    });
    await server.start();
    server.applyMiddleware({ app });
    router.get("/", (ctx) => {
        ctx.body = "Welcome to Library GraphQL API!";
    });
    app.use(router.routes()).use(router.allowedMethods());
    return app;
};
exports.createApp = createApp;
