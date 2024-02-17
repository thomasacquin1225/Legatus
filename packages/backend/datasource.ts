import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  "type": "sqlite",
  "database": "./groups.db",
  "synchronize": true,
  "logging": true,
  "entities": [
    "groups/**/*.ts"
  ],
  "migrations": [
    "src/migration/**/*.ts"
  ],
});
