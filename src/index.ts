import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";

import { RegisterResolver } from "./modules/user/Register";

const PORT = process.env.PORT || 4000;

(async function main() {
  // Create connection to database
  await createConnection();

  const schema = await buildSchema({
    resolvers: [RegisterResolver],
  });
  const apolloServer = new ApolloServer({ schema });

  const app = Express();

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () =>
    console.log(
      `🚀 The graphql server is starting at http://localhost:${PORT}/graphql`
    )
  );
})();
