import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import { graphqlUploadExpress } from "graphql-upload";
import {
  getComplexity,
  fieldExtensionsEstimator,
  simpleEstimator,
} from "graphql-query-complexity";

import { redis } from "./redis";
import { createSchema } from "./utils/createSchema";

const PORT = process.env.PORT || 4000;

const main = async () => {
  // Create connection to database
  await createConnection();

  const schema = await createSchema();
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
    uploads: false,
    plugins: [
      {
        requestDidStart: () => ({
          didResolveOperation({ request, document }) {
            const complexity = getComplexity({
              schema,
              operationName: request.operationName,
              query: document,
              variables: request.variables,
              estimators: [
                fieldExtensionsEstimator(),

                simpleEstimator({ defaultComplexity: 1 }),
              ],
            });

            if (complexity > 8) {
              throw new Error(
                `Sorry, too complicated query! ${complexity} is over 8 that is the max allowed complexity.`
              );
            }
            console.log("Used query complexity points:", complexity);
          },
        }),
      },
    ],
  });

  const app = Express();

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  const RedisStore = connectRedis(session);

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: "qid",
      secret: "AsDduXXDfs139Dcj9cd",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );

  // Upload images/files
  app.use(graphqlUploadExpress({ maxFieldSize: 10000000, maxFiles: 10 }));

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(
      `🚀 The graphql server is starting at http://localhost:${PORT}/graphql`
    );
  });
};

main();
