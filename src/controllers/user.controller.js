import { pool } from "../database/connect.db.js";

const fetchUserProfile = async (req, res) => {
  const userId = req.userId;

  const userProfileQuery = "SELECT * FROM users WHERE id = $1";

  try {
    const userProfile = await pool.query(userProfileQuery, [userId]);
    res.status(200).json({ success: true, user: userProfile.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { fetchUserProfile };
