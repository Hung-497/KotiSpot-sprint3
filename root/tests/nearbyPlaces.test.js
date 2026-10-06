const request = require("supertest");
const app = require("../app");
const {
  clearNearbyPlacesCache,
} = require("../services/nearbyPlacesService");

const realFetch = global.fetch;

const overpassResponse = (elements) => ({
  ok: true,
  status: 200,
  json: async () => ({ elements }),
});

const failedResponse = (status) => ({
  ok: false,
  status,
  json: async () => ({}),
});

const cafe = {
  id: 1,
  lat: 60.2,
  lon: 24.95,
  tags: { amenity: "cafe", name: "Kahvila", opening_hours: "8-16" },
};

describe("GET /api/properties/nearby", () => {
  beforeEach(() => {
    clearNearbyPlacesCache();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    global.fetch = realFetch;
    vi.restoreAllMocks();
  });

  it("returns nearby places with only the fields the map uses", async () => {
    global.fetch = vi.fn().mockResolvedValue(overpassResponse([cafe]));

    const res = await request(app)
      .get("/api/properties/nearby")
      .query({ lat: 60.2, lon: 24.95 });

    expect(res.status).toBe(200);
    expect(res.body.unavailable).toBe(false);
    expect(res.body.places).toEqual([
      { id: 1, lat: 60.2, lon: 24.95, tags: { amenity: "cafe", name: "Kahvila" } },
    ]);
  });

  it("falls back to the next server when one returns 504", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(failedResponse(504))
      .mockResolvedValueOnce(overpassResponse([cafe]));

    const res = await request(app)
      .get("/api/properties/nearby")
      .query({ lat: 60.2, lon: 24.95 });

    expect(res.status).toBe(200);
    expect(res.body.places).toHaveLength(1);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("caches results so repeat visits don't query Overpass again", async () => {
    global.fetch = vi.fn().mockResolvedValue(overpassResponse([cafe]));

    await request(app).get("/api/properties/nearby").query({ lat: 60.2, lon: 24.95 });
    await request(app).get("/api/properties/nearby").query({ lat: 60.2, lon: 24.95 });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("answers 200 with unavailable: true when every server fails", async () => {
    global.fetch = vi.fn().mockResolvedValue(failedResponse(504));

    const res = await request(app)
      .get("/api/properties/nearby")
      .query({ lat: 60.2, lon: 24.95 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ places: [], unavailable: true });
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it("treats a 200 response with a timeout remark as a failure", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ remark: "runtime error: Query timed out", elements: [] }),
    });

    const res = await request(app)
      .get("/api/properties/nearby")
      .query({ lat: 60.2, lon: 24.95 });

    expect(res.body.unavailable).toBe(true);
  });

  it.each([
    [{}],
    [{ lat: 60.2 }],
    [{ lat: "abc", lon: 24.95 }],
    [{ lat: 95, lon: 24.95 }],
    [{ lat: 60.2, lon: 200 }],
  ])("rejects invalid coordinates %o", async (query) => {
    global.fetch = vi.fn();

    const res = await request(app).get("/api/properties/nearby").query(query);

    expect(res.status).toBe(400);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
