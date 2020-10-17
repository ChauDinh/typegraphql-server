# TypeGraphQL Series

1. Setting up type-graphql
2. Register mutation
3. Validation input
4. Login mutation
5. Authorization/Middleware
6. Confirming email
7. Forgot/change password
8. Logout mutation
9. Testing with Jest
10. Higher order resolvers
11. updating...

## TypeGraphQL setup

#### 1. Installation

We use `yarn` for the project, so to start (initialize) you need to install
`yarn` and then create the project folder `mkdir typegraphql-server && cd typegraphql-server`.

Next, we need to install `express`, a Node.js framework for building server.

```
yarn add apollo-server-express express graphql reflect-metadata type-graphql
```

Also, we need to install the "typed" version of these packages so that we can
use with TypeScript.

```
yarn add -D @types/express @types/graphql @types/node nodemon ts-node typescript
```

#### 2. The `tsconfig.json` file

Then we create a `tsconfig.json` file to tell typescript how to compile our
code.

```JSON
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "lib": ["dom", "es6", "es2017", "esnext.asynciterable"],
    "sourceMap": true,
    "outDir": "./dist",
    "moduleResolution": "node",
    "declaration": false,

    "composite": false,
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "rootDir": "src"
  },
  "exclude": ["node_modules"],
  "include": ["./src/**/*.tsx", "./src/**/*.ts"]
}
```

Now we have enough resource for starting a server at `src/index.ts`. This is an
Apollo Server, connecting to database `PostgreSQL`, or you can connect with
`REST API` you already have.

```typescript
import {ApolloServer} from "apollo-server-express";
...

const main = async () => {
// create apollo server instance
const apolloServer = new ApolloServer({
  // schemas
  // resolvers
});
}

main();
```

#### 3. `type-graphql` comes in

Our Apollo Server needs two basic elements: schemas and resolvers. Since we use
TypeScript, we have to type these elements and this is when `type-graphql` comes
in.

```typescript

```
