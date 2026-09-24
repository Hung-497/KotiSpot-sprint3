require("dotenv").config();

const MONGO_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGO_URI
    : process.env.MONGO_URI;

module.exports = {
  MONGO_URI,
  PORT: process.env.PORT || 4000,
  OTP_SECRET: process.env.OTP_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
};