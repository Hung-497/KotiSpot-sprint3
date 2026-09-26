const express = require("express");
const cors = require("cors");
const { unknownEndpoint, errorHandler } = require("./middleware/customMiddleware");
const propertyRouter = require("./routes/propertyRouter");
const favouritesRouter = require("./routes/favouritesRouter");
const moderationRouter = require("./routes/moderationRouter");
const userRouter = require("./routes/userRouter");
const loginRouter = require("./routes/loginRouter");
const verificationRouter = require("./routes/verificationRouter");
const inquiryRouter = require("./routes/inquiryRouter");
const contactRouter = require("./routes/contactRouter");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "10mb" })); // bigger limit for application pictures

app.use("/api/properties", propertyRouter);
app.use("/api/favourites", favouritesRouter);
app.use("/api/moderation", moderationRouter);
app.use("/api/users", userRouter);
app.use("/api/account", loginRouter);
app.use("/api/verifications", verificationRouter);
app.use("/api/inquiries", inquiryRouter);
app.use("/api/contact-messages", contactRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;