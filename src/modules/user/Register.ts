import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "./../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { isAuth } from "./../../authentication/isAuth";

@Resolver()
export class RegisterResolver {
  @UseMiddleware(isAuth)
  @Query(() => String, {
    nullable: true,
    description: "hello world query for testing",
  })
  hello() {
    return "hello, world";
  }

  @Mutation(() => User)
  async register(
    @Arg("data") { firstName, lastName, email, password }: RegisterInput
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
