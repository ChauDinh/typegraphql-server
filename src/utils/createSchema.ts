import {
  CreateUserResolver,
  CreateProductResolver,
} from "./../modules/user/CreateUser";
import { RegisterResolver } from "../modules/user/register/Register";
import { MeResolver } from "../modules/user/me/Me";
import { LogoutResolver } from "../modules/user/logout/Logout";
import { LoginResolver } from "../modules/user/login/Login";
import { ForgotPasswordResolver } from "../modules/user/forgotPassword/ForgotPassword";
import { ConfirmUserResolver } from "../modules/user/confirm/ConfirmUser";
import { ChangePasswordResolver } from "../modules/user/changePassword/ChangePassword";
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
      CreateUserResolver,
      CreateProductResolver,
    ],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });
