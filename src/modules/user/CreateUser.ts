import { RegisterInput } from "./register/RegisterInput";
import { User } from "./../../entity/User";
import {
  Resolver,
  Mutation,
  ClassType,
  Arg,
  InputType,
  Field,
} from "type-graphql";
import { Product } from "../../entity/Product";

function createResolver<T extends ClassType, X extends ClassType>(
  suffix: string,
  returnType: T,
  inputType: X,
  entity: any
) {
  @Resolver()
  class BaseResolver {
    @Mutation(() => returnType, { name: `create${suffix}` })
    async create(@Arg("data", () => inputType) data: any) {
      return await entity.create(data).save();
    }
  }

  return BaseResolver;
}

export const CreateUserResolver = createResolver(
  "User",
  User,
  RegisterInput,
  User
);

@InputType()
class ProductInput {
  @Field()
  name: string;
}

export const CreateProductResolver = createResolver(
  "Product",
  Product,
  ProductInput,
  Product
);
