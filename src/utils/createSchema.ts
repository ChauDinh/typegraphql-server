import { RegisterResolver } from "./../modules/user/Register";
import { MeResolver } from "./../modules/user/Me";
import { LogoutResolver } from "./../modules/user/Logout";
import { LoginResolver } from "./../modules/user/Login";
import { ForgotPasswordResolver } from "./../modules/user/ForgotPassword";
import { ConfirmUserResolver } from "./../modules/user/ConfirmUser";
import { ChangePasswordResolver } from "./../modules/user/ChangePassword";
import { buildSchema } from "type-graphql";

export const createSchema = async () =>
  await buildSchema({
    resolvers: [
      ChangePasswordResolver,
      ConfirmUserResolver,
      ForgotPasswordResolver,
      LoginResolver,
      LogoutResolver,
      MeResolver,
      RegisterResolver,
    ],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });
