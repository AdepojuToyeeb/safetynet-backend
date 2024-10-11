export default () => ({
  db: {
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PW,
    database: process.env.POSTGRES_DB,
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    synchronize: process.env.SYNCHRONIZE_DB === "true" || false,
    autoLoadEntities: true,
  },
});
