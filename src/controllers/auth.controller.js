import { pool } from "../database/connect.db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const registerUser = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match",
    });
  }

  const userCheckQuery = "SELECT * FROM users WHERE email = $1";

  try {
    const userCheck = await pool.query(userCheckQuery, [email]);
    if (userCheck.rowCount > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();

    const userInsertQuery =
      "INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *";

    const user = await pool.query(userInsertQuery, [
      userId,
      username,
      email,
      hashedPassword,
    ]);

    const token = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "4h" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: user.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide username and password",
    });
  }

  const userCheckQuery = "SELECT * FROM users WHERE username = $1";

  try {
    const userCheck = await pool.query(userCheckQuery, [username]);

    if (userCheck.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      userCheck.rows[0].password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: userCheck.rows[0].id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "4h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userCheck.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
};

export { registerUser, loginUser };
