const mongoose = require("mongoose");
const config = require("./config/config");
const {
  destroySeedData,
  importSeedData,
  resetSeedData,
} = require("./data/seedDatabase");

const actions = {
  "--import": { label: "imported", run: importSeedData },
  "-i": { label: "imported", run: importSeedData },
  "--destroy": { label: "destroyed", run: destroySeedData },
  "-d": { label: "destroyed", run: destroySeedData },
  "--reset": { label: "reset", run: resetSeedData },
  "-r": { label: "reset", run: resetSeedData },
};

const printUsage = () => {
  console.log("Usage: node seeder.js [--import | --destroy | --reset]");
};

const assertDevelopmentDatabase = ({
  nodeEnv = process.env.NODE_ENV,
  mongoUri = config.MONGO_URI,
  testMongoUri = process.env.TEST_MONGO_URI,
} = {}) => {
  if (nodeEnv !== "development") {
    throw new Error("Seed commands require NODE_ENV=development.");
  }

  if (!mongoUri) {
    throw new Error("MONGO_URI must be configured before running seed commands.");
  }

  if (testMongoUri && mongoUri.trim() === testMongoUri.trim()) {
    throw new Error(
      "MONGO_URI must not point to TEST_MONGO_URI when running development seed commands.",
    );
  }
};

const formatCounts = (counts) =>
  Object.entries(counts)
    .map(([name, count]) => `${name}=${count}`)
    .join(", ");

const run = async () => {
  const argument = process.argv[2] || "--import";

  if (["--help", "-h"].includes(argument)) {
    printUsage();
    return;
  }

  const action = actions[argument];
  if (!action) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  try {
    assertDevelopmentDatabase();
    await mongoose.connect(config.MONGO_URI);
    const counts = await action.run();
    console.log(`Seed data ${action.label}: ${formatCounts(counts)}`);
  } catch (error) {
    console.error(`Seed operation failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
};

if (require.main === module) {
  run();
}

module.exports = {
  assertDevelopmentDatabase,
  run,
};
