import { createPool } from "mysql";

import { config } from "dotenv";

config();


const db = createPool({
  host: process.env.HOST,
  password: process.env.PASSWORD,
  user: process.env.USER,
  database: process.env.DATABASE
});

export { db };