const crypto = require("crypto");
const AuthCode = require("../models/authCodeModel");
const { sendLoginCode } = require("../services/email");
const { OTP_SECRET } = require("../config/config");
const User = require("../models/userModel");

const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5; // Maximum number of attempts allowed
const REQUEST_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 1 minute
const MAX_CODE_REQUESTS = 5; // Maximum number of code requests allowed within the request window

const normalizeEmail = (value) => {
  if (typeof value !== "string") {
    return null;
  }
  const email = value.trim().toLowerCase();

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return null;
  }
  return email;
};

const hashCode = (email, code) => {
  return crypto
    .createHmac("sha256", OTP_SECRET)
    .update(`${email}:${code}`)
    .digest("hex");
};

const requestCode = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!email) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const now = new Date();
    const existingAuthCode = await AuthCode.findOne({ email });
    let requestCount = 0;
    let requestWindowStartedAt = now;

    if (existingAuthCode) {
      if (
        existingAuthCode.lastSentAt &&
        now - existingAuthCode.lastSentAt < RESEND_COOLDOWN_MS
      ) {
        return res.status(429).json({
          message: "Please wait before requesting a new code",
        });
      }

      if (
        existingAuthCode.requestWindowStartedAt &&
        now - existingAuthCode.requestWindowStartedAt < REQUEST_WINDOW_MS
      ) {
        requestCount = existingAuthCode.requestCount;
        requestWindowStartedAt = existingAuthCode.requestWindowStartedAt;
      }

      if (requestCount >= MAX_CODE_REQUESTS) {
        return res.status(429).json({
          message: "Too many requests. Please try again later.",
        });
      }
    }

    const code = crypto.randomInt(100000, 1000000).toString();
    const codeHash = hashCode(email, code);

    await AuthCode.findOneAndUpdate(
      { email },
      {
        email,
        codeHash,
        attempts: 0,
        requestCount: requestCount + 1,
        requestWindowStartedAt: requestWindowStartedAt,
        lastSentAt: now,
        expiresAt: new Date(Date.now() + CODE_TTL_MS),
      },
      { upsert: true, returnDocument: "after" },
    );

    await sendLoginCode(email, code);

    res.status(200).json({ message: "Login code sent" });
  } catch (error) {
    console.error("Error requesting login code:", error);
    res.status(500).json({ message: "Failed to send login code" });
  }
};

const verifyCode = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const code = String(req.body.code || "").trim();

    if (!email || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ message: "Invalid or expired login code" });
    }

    const authCode = await AuthCode.findOne({ email });

    if (!authCode || authCode.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired login code" });
    }

    if (authCode.attempts >= MAX_ATTEMPTS) {
      return res
        .status(429)
        .json({ message: "Too many attempts. Please request a new code." });
    }

    const submittedHash = hashCode(email, code);

    const storedBuffer = Buffer.from(authCode.codeHash, "hex");
    const submittedBuffer = Buffer.from(submittedHash, "hex");

    const matches = crypto.timingSafeEqual(storedBuffer, submittedBuffer);

    if (!matches) {
      authCode.attempts += 1;
      await authCode.save();

      if (authCode.attempts >= MAX_ATTEMPTS) {
        await AuthCode.deleteOne({ _id: authCode._id });

        return res
          .status(429)
          .json({ message: "Too many attempts. Please request a new code." });
      }

      return res.status(400).json({ message: "Invalid or expired login code" });
    }
    await AuthCode.deleteOne({ _id: authCode._id });

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
      });
    }

    res.status(200).json({
      message: "Login code verified",
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        verifiedAt: user.verifiedAt,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Failed to verify login code" });
  }
};

const simulateRegistration = (req, res) => {
  const email = normalizeEmail(req.body?.email);

  if (email === null) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email address", field: "email" });
  }

  res.status(200).json({
    success: true,
    simulated: true,
    message: "Registration successfully",
    mockAuthState: {
      loggedIn: true,
      user: {
        email,
        role: "buyer",
      },
    },
  });
};

const simulateLogin = (req, res) => {
  const email = normalizeEmail(req.body?.email);

  if (email === null) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email address", field: "email" });
  }

  res.status(200).json({
    success: true,
    simulated: true,
    message: "Login successful",
    mockAuthState: {
      loggedIn: true,
      user: {
        email,
        role: "buyer",
      },
    },
  });
};

const simulateLogout = (req, res) => {
  res.status(200).json({
    success: true,
    simulated: true,
    message: "Logout successful",
    mockAuthState: {
      loggedIn: false,
      user: null,
    },
  });
};

module.exports = {
  requestCode,
  verifyCode,
  simulateRegistration,
  simulateLogin,
  simulateLogout,
};
