import { Connection } from "typeorm";

import { testConnection } from "./../../../__test__/testConnection";
import { grapqhlCall } from "./../../../__test__/graphqlCall";

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
    console.log(
      await grapqhlCall({
        source: registerMutation,
        variableValues: {
          data: {
            firstName: "nguyen",
            lastName: "nguyen",
            email: "nguyennguyen95@email.com",
            password: "123456",
          },
        },
      })
    );
  });
});
