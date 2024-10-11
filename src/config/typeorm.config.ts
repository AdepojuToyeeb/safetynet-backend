require("dotenv").config();
import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PW,
  database: process.env.POSTGRES_DB,
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  entities: [`src/models/*{.ts,.js}`],
  migrations: [`src/migrations/*{.ts,.js}`],
  migrationsRun: true
});

dataSource.initialize();

export default dataSource;
