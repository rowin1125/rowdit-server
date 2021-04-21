import "reflect-metadata";

import cors from "cors";
import Redis from "ioredis";
import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import { MikroORM } from "@mikro-orm/core";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";

import mikroConfig from "./mikro-orm.config";

import { MyContext } from "./types";
import { COOKIE_NAME, __prod__ } from "./constants";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { HalloResolver } from "./resolvers/hello";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const app = express();
  const port = 7777;

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        // This will keep the value forever in redis, regular
        // behaviour is refresh on touch
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 Years
        httpOnly: true,
        secure: __prod__, // Cookie only works in https
        sameSite: "lax", // Protecting CSRF
      },
      saveUninitialized: false,
      secret: "banana",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HalloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res, redis }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(port, () => console.log(`🚀 Server started on localhost:${port}`));
};

main().catch((err) => console.error(err));
