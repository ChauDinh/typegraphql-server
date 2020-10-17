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

We will create a simple resolver, you can test with it to make sure everything
works.

- First we need to create a resolver, called `Hello Resolver`. It is a `Query`
  resolver since it just returns a string, not access to database.
- Second, pass the resolver to the Apollo Server resolvers.

```TypeScript
...
import {buildSchema, Resolver} from "type-graphql";

@Resolver()
class HelloResolver {
  @Query(() => String)
  async hello() {
    return "Hello, world!";
  }
}

const main = async () => {
  const schema = await buildSchema({
    resolvers: [HelloResolver], // an array of resolvers
  });

  const apolloServer = new ApolloServer({
    schema
  });

  const app = Express();

  apolloServer.applyMiddleware({app});

  app.listen(4000, () => console.log("server is starting on http://localhost:4000"));

}

main();
```

To start our server, go to our `package.json` file and create a script start:

```json
"scripts": {
  "start": "ts-node src/index.ts"
}
```

If you meet the error `Reflect.getMetadata` is not a function like me, we need
to import `reflect-metadata` at the top of our server file.

```typescript
import "reflect-metadata";
import {ApolloServer} from "apollo-server-express";
...
```

Now our server should be started up successfully, we can go to
`http://localhost:4000/graphql` to check the graphql playground.

#### 4. Register resolver

Create an user is a graphql resolver, not query like hello resolver, since we
need to access our database (we use PostgreSQL).

We need an ORM to transform our JavaScript/TypeScript object into table so that
we can store them in relational database. The tool we use is `typeorm` as
`type-graphql` supports very well with it.

First, we need to install `type-orm` and packages for register mutation.

```
yarn add type-orm pg bcryptjs
yarn add -D @types/bcryptjs
```

In the root directory, we create a file called `ormconfig.json` for defining the
connection how to connect to our database.

```json
{
  "name": "default",
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "your-user-name",
  "password": "your-password",
  "database": "test",
  "synchronize": true, // enable our db auto create when launch
  "logging": true, // to see sql queries in our terminal
  "entities": ["src/entity/*.*"]
}
```

If you're new with PostgreSQL, check the article for how to install, connect to,
and create use:
https://medium.com/coding-blocks/creating-user-database-and-adding-access-on-postgresql-8bfcd2f4a91e

Next, we will create a connection from our server to database with these
configs.

```TypeScript
import {createConnection} from "typeorm";

const main = async () => {
  await createConnection();
  ...
}
```

Create `User` entity:

```TypeScript
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column("text", {unique: true}) // we don't want duplicated email in db.
  email: string;

  @Column()
  password: string;
}
```

So now when we start server again, it would create table for us. The next step
is creating mutation for register user, we split the logic for CRUD tasks in
`modules/user/Register.ts` folder, instead of writing inside the `index.ts` like the hello
resolver before.

```typescript
@Resolver()
class RegisterResolver {
  @Mutation(() => User)
  async register(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();

    return user;
  }
}
```

#### 5. Validate input with `class-validator`

In a real application, when we allow user register, we also need to check
whether the information typed in input fields are legal, for example legal
email (unique or not), password length, username, etc.

We have 4 fields as parameters in register resolver, we will split these fields
into `RegisterInput` file for validation (the structure folder here is called
Fractal Pattern, you can check from the article: https://hackernoon.com/fractal-a-react-app-structure-for-infinite-scale-4dab943092af)

```typescript
@InputType()
class RegisterInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
```

and in `Register` mutation, we just need 1 field which we can destruct it and
get 4 elements in the register input:

```typescript
@Mutation(() => User)
async register(
  @Arg("data") {email, firstName, lastName, password}: RegisterInput
): Promise<User> {
  ...
}
```

Now we can back to our `RegisterInput` field to validate:

```TypeScript
import {Length, IsEmail} from "class-validator";

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 30) // the first name should be length from 1 to 30
  firstName: string;

  @Field()
  @Length(1, 30) // the last name should be length from 1 to 30
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}
```

And we've done the validation for register input fields. You can come back
GraphQL Playground and try yourself.

Notice: since we move the parameters of `register` function into other file, our
register mutation in the playground should be something likes that:

```graphql
mutation {
  register(data: { firstName: "", lastName: "", email: "", password: "" }) {
    id
    firstName
    lastName
    email
  }
}
```

<b>Display error message to client</b>

If you try invalid input fields in register mutation, we would see graphql
through an error which is an array. We just need the message to send it to the
client, for example:

```
Invalid email/username/password
```

So you need to do something like "formatting errors", and `type-graphql` provide
a function that handle this task for us.

```TypeScript
...
const apolloServer = new ApolloServer({
  schema, formatError: formatArgumentValidationError
})
```

Now we back to our `RegisterInput` to config the error message for each field:

```TypeScript
@Field()
@Length(1, 255, {message: "Your message here"})
```

<b>Custom decorator</b>

Besides default decorators for checking input, we can also custom decorator for
ourselves. In this example, we need to throw an error when client register with
an already exists email (the email should be unique in our db).

```TypeScript
@ValidatorConstraint({async: true})
export class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
  validate(email: string) {
    return User.findOne({
      where: {email}
    })
    .then(user => {
      if (user) return false;
      return true;
    })
  }
}

export const IsEmailAlreadyExist(validationOptions? : ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAlreadyExistsConstraint
    })
  }
}
```

In our `RegisterInput`, now we can use the decorator we've just created for the
email field:

```TypeScript
export class RegisterInput {
  ...
  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({message: "email already in used"})
  email: string;
}
```

For more details, we can check the docs of `class-validator`:
https://github.com/typestack/class-validator#custom-validation-decorators

#### 6. Login mutation
