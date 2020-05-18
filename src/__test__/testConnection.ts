import { createConnection } from "typeorm";

export const testConnection = (isDrop: boolean = false) => {
  return createConnection({
    name: "default",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "chaudinh",
    password: "katetsui1995",
    database: "typegraphql-server-test",
    synchronize: isDrop,
    dropSchema: isDrop,
    entities: [__dirname + "/../entity/*.*"],
  });
};
