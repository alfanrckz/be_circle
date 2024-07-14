import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "viaduct.proxy.rlwy.net",
  port: 29568,
  username: "postgres",
  password: "RRzgoHUwBuzilDXsWlkHQudysXxvAsAx",
  database: "railway",
  synchronize: true,
  logging: false,
  entities: ["src/entity/*.ts"],
  migrations: ["src/migration/*.ts"],
  subscribers: [],
});
