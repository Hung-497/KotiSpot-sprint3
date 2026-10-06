const {
  requireRole,
  requireVerifiedSellerOrAgent,
  requirePropertyOwner,
} = require("../middleware/authMiddleware");
const Property = require("../models/propertyModel");
const mongoose = require("mongoose");

const createResponse = () => {
  const res = {
    statusCode: null,
    body: null,
  };

  res.status = (code) => {
    res.statusCode = code;
    return res;
  };

  res.json = (body) => {
    res.body = body;
    return res;
  };

  return res;
};

describe("requireRole", () => {
  it("should return 401 when there is no authenticated user", () => {
    const req = {};
    const res = createResponse();

    let nextCalled = false;

    requireRole("administrator")(req, res, () => {
      nextCalled = true;
    });

    expect(res.statusCode).toBe(401);
    expect(nextCalled).toBe(false);
  });

  it("should return 403 when the user does not have an allowed role", () => {
    const req = {
      user: {
        role: "buyer",
      },
    };

    const res = createResponse();

    let nextCalled = false;

    requireRole("administrator")(req, res, () => {
      nextCalled = true;
    });

    expect(res.statusCode).toBe(403);
    expect(nextCalled).toBe(false);
  });

  it("should continue when the user has an allowed role", () => {
    const req = {
      user: {
        role: "administrator",
      },
    };

    const res = createResponse();

    let nextCalled = false;

    requireRole("administrator")(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
    expect(res.statusCode).toBeNull();
  });
});

describe("requireVerifiedSellerOrAgent", () => {
  it("should return 401 when there is no authenticated user", () => {
    const req = {};
    const res = createResponse();

    let nextCalled = false;

    requireVerifiedSellerOrAgent(req, res, () => {
      nextCalled = true;
    });

    expect(res.statusCode).toBe(401);
    expect(nextCalled).toBe(false);
  });

  it("should return 403 for a buyer", () => {
    const req = {
      user: {
        role: "buyer",
        verifiedAt: new Date(),
      },
    };

    const res = createResponse();

    let nextCalled = false;

    requireVerifiedSellerOrAgent(req, res, () => {
      nextCalled = true;
    });

    expect(res.statusCode).toBe(403);
    expect(nextCalled).toBe(false);
  });

  it("should return 403 for an unverified seller", () => {
    const req = {
      user: {
        role: "seller",
        verifiedAt: null,
      },
    };

    const res = createResponse();

    let nextCalled = false;

    requireVerifiedSellerOrAgent(req, res, () => {
      nextCalled = true;
    });

    expect(res.statusCode).toBe(403);
    expect(nextCalled).toBe(false);
  });

  it("should continue for a verified seller", () => {
    const req = {
      user: {
        role: "seller",
        verifiedAt: new Date(),
      },
    };

    const res = createResponse();

    let nextCalled = false;

    requireVerifiedSellerOrAgent(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
    expect(res.statusCode).toBeNull();
  });

  it("should continue for a verified agent", () => {
    const req = {
      user: {
        role: "agent",
        verifiedAt: new Date(),
      },
    };

    const res = createResponse();

    let nextCalled = false;

    requireVerifiedSellerOrAgent(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
    expect(res.statusCode).toBeNull();
  });
});

describe("requirePropertyOwner", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 401 when there is no authenticated user", async () => {
    const req = {
      params: {
        propertyId: new mongoose.Types.ObjectId().toString(),
      },
    };

    const res = createResponse();

    let nextCalled = false;

    await requirePropertyOwner(req, res, () => {
      nextCalled = true;
    });

    expect(res.statusCode).toBe(401);
    expect(nextCalled).toBe(false);
  });

  it("should return 404 when the property does not exist", async () => {
    const userId = new mongoose.Types.ObjectId();
    const propertyId = new mongoose.Types.ObjectId();

    vi.spyOn(Property, "findById").mockResolvedValue(null);

    const req = {
      user: {
        _id: userId,
      },
      params: {
        propertyId: propertyId.toString(),
      },
    };

    const res = createResponse();

    let nextCalled = false;

    await requirePropertyOwner(req, res, () => {
      nextCalled = true;
    });

    expect(res.statusCode).toBe(404);
    expect(nextCalled).toBe(false);
  });

  it("should return 403 when the user does not own the property", async () => {
    const userId = new mongoose.Types.ObjectId();
    const otherUserId = new mongoose.Types.ObjectId();
    const propertyId = new mongoose.Types.ObjectId();

    vi.spyOn(Property, "findById").mockResolvedValue({
      _id: propertyId,
      owner: otherUserId,
    });

    const req = {
      user: {
        _id: userId,
      },
      params: {
        propertyId: propertyId.toString(),
      },
    };

    const res = createResponse();

    let nextCalled = false;

    await requirePropertyOwner(req, res, () => {
      nextCalled = true;
    });

    expect(res.statusCode).toBe(403);
    expect(nextCalled).toBe(false);
  });

  it("should continue when the user owns the property", async () => {
    const userId = new mongoose.Types.ObjectId();
    const propertyId = new mongoose.Types.ObjectId();

    const property = {
      _id: propertyId,
      owner: userId,
    };

    vi.spyOn(Property, "findById").mockResolvedValue(property);

    const req = {
      user: {
        _id: userId,
      },
      params: {
        propertyId: propertyId.toString(),
      },
    };

    const res = createResponse();

    let nextCalled = false;

    await requirePropertyOwner(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
    expect(req.property).toBe(property);
  });

  it("should return 400 for an invalid property ID", async () => {
    const req = {
      user: {
        _id: new mongoose.Types.ObjectId(),
      },
      params: {
        propertyId: "invalid-id",
      },
    };

    const res = createResponse();

    let nextCalled = false;

    await requirePropertyOwner(req, res, () => {
      nextCalled = true;
    });

    expect(res.statusCode).toBe(400);
    expect(nextCalled).toBe(false);
  });
});
