import { Resolver, Mutation, Arg } from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import { createWriteStream } from "fs";

import { Upload } from "../../../types/Upload";

@Resolver()
export class ProfileAvatarResolver {
  @Mutation(() => Boolean)
  async addProfileAvatar(
    @Arg("avatar", () => GraphQLUpload) { createReadStream, filename }: Upload
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(
          createWriteStream(__dirname + `/../../../images/avatars/${filename}`)
        )
        .on("finish", () => resolve(true))
        .on("error", () => reject(false))
    );
  }
}
