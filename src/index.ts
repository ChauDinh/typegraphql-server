import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema, Resolver, Query } from "type-graphql";

const PORT = process.env.PORT || 4000;

@Resolver()
class HelloResolver {
  @Query(() => String, {
    nullable: true,
    description: "hello world query for testing",
  })
  hello() {
    return "hello, world";
  }
}

(async function main() {
  const schema = await buildSchema({
    resolvers: [HelloResolver],
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
