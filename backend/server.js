const app = require("./app");
const connectDB = require("./config/db");
const config = require("./config/config");

connectDB();

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});