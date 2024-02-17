import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  "type": "sqlite",
  "database": "./groups.db",
  "synchronize": true,
  "logging": false,
  "entities": [
    "groups/**/*.ts"
  ],
  "migrations": [
    "src/migration/**/*.ts"
  ],
});
