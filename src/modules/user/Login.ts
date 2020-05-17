import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "./../../entity/User";
import { MyContext } from "./../../types/MyContext";

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });

    // TODO: Check if the email invalid
    if (!user) {
      return null;
    }

    // TODO: Check if the password invalid
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return null;
    }

    // TODO: Access the context and send user back a cookie
    ctx.req.session!.userId = user.id;

    return user;
  }
}
