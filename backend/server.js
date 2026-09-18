const express = require("express");
const app = express();
const connectDB = require("./config/db");
const { unknownEndpoint, errorHandler } = require("./middleware/customMiddleware");
const propertyRouter = require("./routes/propertyRouter");
const favouritesRouter = require("./routes/favouritesRouter");
const moderationRouter = require("./routes/moderationRouter");
const userRouter = require("./routes/userRouter");
const loginRouter = require("./routes/loginRouter");
const verificationRouter = require("./routes/verificationRouter");
const inquiryRouter = require("./routes/inquiryRouter");

require("dotenv").config();

// Middleware to parse JSON
app.use(express.json());

connectDB();

// Use the propertyRouter for all /properties routes
app.use("/api/properties", propertyRouter);
app.use("/api/favourites", favouritesRouter);
app.use("/api/moderation", moderationRouter);
app.use("/api/users", userRouter);
app.use("/api/account", loginRouter);
app.use("/api/verifications", verificationRouter);
app.use("/api/inquiries", inquiryRouter);

// Middleware for handling unknown endpoints
app.use(unknownEndpoint);

// Middleware for handling errors
app.use(errorHandler);

const port = process.env.PORT || 4000;
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
