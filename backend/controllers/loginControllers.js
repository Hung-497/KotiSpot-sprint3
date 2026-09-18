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

// Sprint 2 simulation only.
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
  simulateRegistration,
  simulateLogin,
  simulateLogout,
};