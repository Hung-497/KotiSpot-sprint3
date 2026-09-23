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

  // express.json() rejects bodies over its 15mb limit (e.g. too many listing photos)
  if (error.type === "entity.too.large") {
    return res.status(413).json({
      message: "Request is too large. Try uploading fewer or smaller photos.",
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