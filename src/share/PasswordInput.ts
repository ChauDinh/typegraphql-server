import { Field, InputType } from "type-graphql";
import { Min } from "class-validator";

@InputType()
export class PasswordInput {
  @Field()
  @Min(6)
  password: string;
}
