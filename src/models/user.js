const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET || "secret";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

// generate token
userSchema.methods.generateToken = async function () {
  var user = this;
  var token = jwt.sign(user._id.toHexString(), SECRET);
  user.token = token;
  await user.updateOne({ $set: { token: token } });
  return token;
};

// find by token
userSchema.static("findByToken", async (token) => {
  try {
    const decode = jwt.verify(token, SECRET);
    const User = mongoose.model("User");
    const userdata = await User.findOne({ _id: decode, token: token });
    return userdata;
  } catch (err) {
    throw err;
  }
});

// delete token
userSchema.methods.deleteToken = async (token) => {
  try {
    const User = mongoose.model("User");
    const user = await User.updateOne({ $unset: { token: 1 } });
    return user;
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
