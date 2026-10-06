const unknownEndpoint = (req, res) => {
  res.status(404).json({
    message: "Unknown endpoint",
  });
};

const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "Invalid JSON body",
    });
  }

  res.status(500).json({
    message: "Internal server error",
  });
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};