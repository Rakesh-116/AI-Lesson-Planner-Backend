import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: "localhost",
  user: process.env.DB_USER_NAME,
  port: 5432,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

async function connectDB() {
  try {
    await pool.connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
}

export default connectDB;
export { pool };
