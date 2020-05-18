import { Connection } from "typeorm";
import faker from "faker";

import { testConnection } from "./../../../__test__/testConnection";
import { grapqhlCall } from "./../../../__test__/graphqlCall";
import { User } from "./../../../entity/User";

let connection: Connection;
beforeAll(async () => {
  connection = await testConnection();
});
afterAll(async () => {
  await connection.close();
});

const registerMutation = `
  mutation Register($data: RegisterInput!){
    register(data: $data) {
      id
      firstName
      lastName
      name
      email
    }
  }
`;

describe("Test Register", () => {
  it("create user", async () => {
    const user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await grapqhlCall({
      source: registerMutation,
      variableValues: {
        data: user,
      },
    });

    expect(response).toMatchObject({
      data: {
        register: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    });

    const dbUser = await User.findOne({ where: { email: user.email } });
    expect(dbUser).toBeDefined();
    expect(dbUser!.confirmed).toBeFalsy();
    expect(dbUser!.firstName).toBe(user.firstName);
  });
});
