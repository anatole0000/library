import Koa from "koa";
import Router from "koa-router";
import cors from "koa-cors";
import koaBody from "koa-body";
import { ApolloServer } from "@apollo/server";
import { koaMiddleware } from '@as-integrations/koa';
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { authMiddleware } from "./middleware/authMiddleware";
import dotenv from "dotenv";


dotenv.config();
export const createApp = async () => {
  const app = new Koa();
  const router = new Router();

  // Middleware xác thực JWT
  app.use(authMiddleware);

  


  // Middleware cho CORS + body parsing để upload file hoạt động ổn
  app.use(cors());
  app.use(koaBody({ multipart: true }));

  // Khởi tạo Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  // Sử dụng Apollo Koa middleware theo cách của Apollo Server 4.x
  app.use(
    koaMiddleware(server, {
      context: async ({ ctx }: { ctx: Koa.Context }) => ({
        user: ctx.state.user,
      }),
    })
  );

  router.get("/", (ctx) => {
    ctx.body = "Welcome to Library GraphQL API!";
  });

  app.use(router.routes()).use(router.allowedMethods());

  return app;
};
