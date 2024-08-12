const User = require("../models/user");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const login = async (req, res) => {
  const { accessToken, credential } = req.body;
  try {
    if (!credential && !accessToken) {
      return res.status(400).json({ message: "Login failed!" });
    }

    const result = accessToken
      ? await axios.get(
          "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
      : jwt.decode(credential);

    if (!result) return res.status(400).json({ message: "Login failed!" });

    const id = result?.data?.id || result?.sub;
    const email = result?.data?.email || result?.email;
    const name = result?.data?.name || result?.name;
    const picture = result?.data?.picture || result?.picture;

    if (!id || !email || !name || !picture)
      return res.status(400).json({ message: "Login failed!" });

    const existingUser = await User.findOne({
      isActive: true,
      email,
    });

    if (!existingUser) {
      const newUser = new User({
        email,
        name,
        avatar: picture,
      });

      const user = await newUser.save();

      const token = await newUser.generateToken();

      return res
        .cookie("auth", token, {
          sameSite: "none",
          secure: true,
        })
        .json(user);
    }

    const token = await existingUser.generateToken();
    return res
      .cookie("auth", token, {
        sameSite: "none",
        secure: true,
      })
      .json(existingUser);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const me = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies?.auth;
    if (!token) return res.status(400).json({ message: "Invalid token!" });

    const user = await User.findByToken(token);
    if (!user) return res.status(400).json({ message: "Invalid token!" });

    await user.deleteToken();
    return res
      .clearCookie("auth")
      .status(200)
      .json({ message: "Logout successfully!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  login,
  me,
  logout,
};
