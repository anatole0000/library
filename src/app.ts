import Koa from "koa";
import Router from "koa-router";
import { ApolloServer } from "apollo-server-koa";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { authMiddleware } from "./middleware/authMiddleware";

export const createApp = async () => {
  const app = new Koa();
  const router = new Router();

  // Đăng ký middleware xác thực token JWT
  app.use(authMiddleware);

  // Khởi tạo ApolloServer, truyền context để lấy thông tin user từ ctx.state
  const server = new ApolloServer({
    typeDefs,
    resolvers,
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
