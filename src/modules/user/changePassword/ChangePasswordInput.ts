import { Field, InputType } from "type-graphql";

import { PasswordInput } from "./../../../share/PasswordInput";

@InputType()
export class ChangePasswordInput extends PasswordInput {
  @Field()
  token: string;
}
