const supertest = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = require("../app");
const connectDB = require("../config/db");
const User = require("../models/userModel");
const { JWT_SECRET } = require("../config/config");

const api = supertest(app);

let user;
let token;

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await User.deleteMany({});

  user = await User.create({
    email: "profile@example.com",
    firstName: "Test",
    lastName: "User",
    phone: "0401234567",
    bio: "Original bio",
    role: "seller",
    verifiedAt: new Date(),
  });

  token = jwt.sign({ _id: user._id }, JWT_SECRET, {
    expiresIn: "3d",
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /api/users/me", () => {
  it("should reject profile access without authentication", async () => {
    await api.get("/api/users/me").expect(401);
  });

  it("should return the authenticated user's profile", async () => {
    const response = await api
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.user._id).toBe(user._id.toString());
    expect(response.body.user.email).toBe("profile@example.com");
    expect(response.body.user.firstName).toBe("Test");
    expect(response.body.user.lastName).toBe("User");
    expect(response.body.user.phone).toBe("0401234567");
    expect(response.body.user.bio).toBe("Original bio");
    expect(response.body.user.role).toBe("seller");
  });
});

describe("PATCH /api/users/me", () => {
  it("should reject profile updates without authentication", async () => {
    await api
      .patch("/api/users/me")
      .send({
        firstName: "Updated",
      })
      .expect(401);
  });

  it("should update editable fields without allowing protected fields to change", async () => {
    const originalVerifiedAt = user.verifiedAt;

    const response = await api
      .patch("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "Updated",
        lastName: "Profile",
        phone: "0507654321",
        bio: "Updated bio",
        email: "attacker@example.com",
        role: "administrator",
        verifiedAt: null,
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.user.firstName).toBe("Updated");
    expect(response.body.user.lastName).toBe("Profile");
    expect(response.body.user.phone).toBe("0507654321");
    expect(response.body.user.bio).toBe("Updated bio");

    expect(response.body.user.email).toBe("profile@example.com");
    expect(response.body.user.role).toBe("seller");
    expect(new Date(response.body.user.verifiedAt)).toEqual(originalVerifiedAt);
  });
});

describe("POST /api/users", () => {
  it("should not expose direct user creation", async () => {
    await api
      .post("/api/users")
      .send({
        email: "fake@example.com",
        role: "administrator",
      })
      .expect(404);
  });
});

describe("DELETE /api/users/me", () => {
  it("should reject account deletion without authentication", async () => {
    await api.delete("/api/users/me").expect(401);
  });

  it("should delete the authenticated user's account", async () => {
    const response = await api
      .delete("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.message).toBe("User deleted successfully");

    const deletedUser = await User.findById(user._id);

    expect(deletedUser).toBeNull();
  });
});

describe("GET /api/users", () => {
  it("should reject access without authentication", async () => {
    await api.get("/api/users").expect(401);
  });

  it("should reject access for a non-administrator", async () => {
    await api
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`)
      .expect(403);
  });

  it("should allow an administrator to access all users", async () => {
    const administrator = await User.create({
      email: "admin@example.com",
      role: "administrator",
    });

    const adminToken = jwt.sign({ _id: administrator._id }, JWT_SECRET, {
      expiresIn: "3d",
    });

    const response = await api
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(2);
  });
});

describe("GET /api/users/me/preferences", () => {
  it("should reject preference access without authentication", async () => {
    await api.get("/api/users/me/preferences").expect(401);
  });

  it("should return the authenticated user's default preferences", async () => {
    const response = await api
      .get("/api/users/me/preferences")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.preferences).toEqual({
      theme: "system",
      emailNotifications: true,
      marketingEmails: false,
      smsNotifications: false,
    });
  });

  it("should return the authenticated user's saved preferences", async () => {
    user.preferences.theme = "dark";
    user.preferences.emailNotifications = false;
    user.preferences.marketingEmails = true;
    user.preferences.smsNotifications = true;

    await user.save();

    const response = await api
      .get("/api/users/me/preferences")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.preferences).toEqual({
      theme: "dark",
      emailNotifications: false,
      marketingEmails: true,
      smsNotifications: true,
    });
  });

  it("should return only the authenticated user's preferences", async () => {
    const anotherUser = await User.create({
      email: "another@example.com",
      role: "buyer",
      preferences: {
        theme: "dark",
        emailNotifications: false,
        marketingEmails: true,
        smsNotifications: true,
      },
    });

    const anotherToken = jwt.sign({ _id: anotherUser._id }, JWT_SECRET, {
      expiresIn: "3d",
    });

    const firstResponse = await api
      .get("/api/users/me/preferences")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const secondResponse = await api
      .get("/api/users/me/preferences")
      .set("Authorization", `Bearer ${anotherToken}`)
      .expect(200);

    expect(firstResponse.body.preferences.theme).toBe("system");

    expect(secondResponse.body.preferences).toEqual({
      theme: "dark",
      emailNotifications: false,
      marketingEmails: true,
      smsNotifications: true,
    });
  });
});

describe("PATCH /api/users/me/preferences", () => {
  it("should reject preference updates without authentication", async () => {
    await api
      .patch("/api/users/me/preferences")
      .send({
        theme: "dark",
      })
      .expect(401);
  });

  it("should reject an empty preferences update", async () => {
    const response = await api
      .patch("/api/users/me/preferences")
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(400);

    expect(response.body.message).toBe("Preferences data is required");
  });

  it("should update the theme preference", async () => {
    const response = await api
      .patch("/api/users/me/preferences")
      .set("Authorization", `Bearer ${token}`)
      .send({
        theme: "dark",
      })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.preferences.theme).toBe("dark");

    const updatedUser = await User.findById(user._id);

    expect(updatedUser.preferences.theme).toBe("dark");
  });

  it("should update all communication preferences", async () => {
    const response = await api
      .patch("/api/users/me/preferences")
      .set("Authorization", `Bearer ${token}`)
      .send({
        emailNotifications: false,
        marketingEmails: true,
        smsNotifications: true,
      })
      .expect(200);

    expect(response.body.preferences).toEqual({
      theme: "system",
      emailNotifications: false,
      marketingEmails: true,
      smsNotifications: true,
    });

    const updatedUser = await User.findById(user._id);

    expect(updatedUser.preferences.emailNotifications).toBe(false);
    expect(updatedUser.preferences.marketingEmails).toBe(true);
    expect(updatedUser.preferences.smsNotifications).toBe(true);
  });

  it("should update all preferences together", async () => {
    const response = await api
      .patch("/api/users/me/preferences")
      .set("Authorization", `Bearer ${token}`)
      .send({
        theme: "light",
        emailNotifications: false,
        marketingEmails: true,
        smsNotifications: true,
      })
      .expect(200);

    expect(response.body.preferences).toEqual({
      theme: "light",
      emailNotifications: false,
      marketingEmails: true,
      smsNotifications: true,
    });
  });

  it("should preserve preferences that are not included in a partial update", async () => {
    user.preferences.theme = "light";
    user.preferences.emailNotifications = false;
    user.preferences.marketingEmails = true;
    user.preferences.smsNotifications = true;

    await user.save();

    const response = await api
      .patch("/api/users/me/preferences")
      .set("Authorization", `Bearer ${token}`)
      .send({
        theme: "dark",
      })
      .expect(200);

    expect(response.body.preferences).toEqual({
      theme: "dark",
      emailNotifications: false,
      marketingEmails: true,
      smsNotifications: true,
    });

    const updatedUser = await User.findById(user._id);

    expect(updatedUser.preferences.theme).toBe("dark");
    expect(updatedUser.preferences.emailNotifications).toBe(false);
    expect(updatedUser.preferences.marketingEmails).toBe(true);
    expect(updatedUser.preferences.smsNotifications).toBe(true);
  });

  it("should persist preferences for later requests", async () => {
    await api
      .patch("/api/users/me/preferences")
      .set("Authorization", `Bearer ${token}`)
      .send({
        theme: "dark",
        emailNotifications: false,
      })
      .expect(200);

    const response = await api
      .get("/api/users/me/preferences")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.preferences.theme).toBe("dark");
    expect(response.body.preferences.emailNotifications).toBe(false);
  });

  it("should reject an invalid theme without changing saved preferences", async () => {
    const response = await api
      .patch("/api/users/me/preferences")
      .set("Authorization", `Bearer ${token}`)
      .send({
        theme: "purple",
      })
      .expect(400);

    expect(response.body.message).toBe("Theme must be light, dark, or system");

    const unchangedUser = await User.findById(user._id);

    expect(unchangedUser.preferences.theme).toBe("system");
  });

  it.each([
    ["emailNotifications", "yes"],
    ["marketingEmails", 1],
    ["smsNotifications", null],
  ])(
    "should reject an invalid %s value without changing preferences",
    async (field, invalidValue) => {
      const originalUser = await User.findById(user._id);
      const originalPreferences = originalUser.preferences.toObject();

      await api
        .patch("/api/users/me/preferences")
        .set("Authorization", `Bearer ${token}`)
        .send({
          [field]: invalidValue,
        })
        .expect(400);

      const unchangedUser = await User.findById(user._id);

      expect(unchangedUser.preferences.toObject()).toEqual(originalPreferences);
    },
  );

  it("should reject an unknown preference field", async () => {
    const response = await api
      .patch("/api/users/me/preferences")
      .set("Authorization", `Bearer ${token}`)
      .send({
        unknownPreference: true,
      })
      .expect(400);

    expect(response.body.message).toBe(
      "Invalid preference field: unknownPreference",
    );
  });

  it("should reject the whole request when a valid preference is mixed with an invalid field", async () => {
    const response = await api
      .patch("/api/users/me/preferences")
      .set("Authorization", `Bearer ${token}`)
      .send({
        theme: "dark",
        unknownPreference: true,
      })
      .expect(400);

    expect(response.body.message).toBe(
      "Invalid preference field: unknownPreference",
    );

    const unchangedUser = await User.findById(user._id);

    expect(unchangedUser.preferences.theme).toBe("system");
  });

  it("should not allow profile fields to be changed through preferences", async () => {
    const response = await api
      .patch("/api/users/me/preferences")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "Hacker",
      })
      .expect(400);

    expect(response.body.message).toBe("Invalid preference field: firstName");

    const unchangedUser = await User.findById(user._id);

    expect(unchangedUser.firstName).toBe("Test");
  });

  it("should not allow protected account fields to be changed through preferences", async () => {
    const originalVerifiedAt = user.verifiedAt;

    await api
      .patch("/api/users/me/preferences")
      .set("Authorization", `Bearer ${token}`)
      .send({
        role: "administrator",
      })
      .expect(400);

    const unchangedUser = await User.findById(user._id);

    expect(unchangedUser.role).toBe("seller");
    expect(new Date(unchangedUser.verifiedAt)).toEqual(originalVerifiedAt);
  });

  it("should update only the authenticated user's preferences", async () => {
    const anotherUser = await User.create({
      email: "other@example.com",
      role: "buyer",
      preferences: {
        theme: "light",
      },
    });

    await api
      .patch("/api/users/me/preferences")
      .set("Authorization", `Bearer ${token}`)
      .send({
        theme: "dark",
      })
      .expect(200);

    const updatedUser = await User.findById(user._id);
    const unchangedOtherUser = await User.findById(anotherUser._id);

    expect(updatedUser.preferences.theme).toBe("dark");
    expect(unchangedOtherUser.preferences.theme).toBe("light");
  });
});
