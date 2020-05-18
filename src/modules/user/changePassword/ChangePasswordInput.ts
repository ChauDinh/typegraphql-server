import { Field, InputType } from "type-graphql";

import { PasswordMixin } from "../../../share/Mixins";

@InputType()
export class ChangePasswordInput extends PasswordMixin(class {}) {
  @Field()
  token: string;
}
