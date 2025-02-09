import { getLastGeneratedCat, generateNewCat } from "../service/catService";
import { Timestamp } from "firebase/firestore";

// Mock the entire module
jest.mock("../service/catService", () => ({
  getLastGeneratedCat: jest.fn(),
  generateNewCat: jest.requireActual("../service/catService").generateNewCat,
}));

const mockedGetLastGeneratedCat = getLastGeneratedCat as jest.Mock;

describe("24-Hour Cat Generation Logic", () => {
  const mockUid = "testUserId";

  test("should generate a new cat if last cat timestamp is null", async () => {
    // Ensure Jest correctly spies on the function
    mockedGetLastGeneratedCat.mockResolvedValue({
      lastGeneratedCatId: null,
      lastGeneratedTimestamp: null,
    });

    const newCatId = await generateNewCat(mockUid);
    expect(newCatId).toBeDefined();
    expect(typeof newCatId).toBe("string");
  });

  test("should generate a new cat if 24 hours have passed", async () => {
    const twentyFiveHoursAgo = Timestamp.now().toMillis() - 25 * 60 * 60 * 1000;

    mockedGetLastGeneratedCat.mockResolvedValue({
      lastGeneratedCatId: "oldCatId",
      lastGeneratedTimestamp: twentyFiveHoursAgo,
    });

    const newCatId = await generateNewCat(mockUid);
    expect(newCatId).toBeDefined();
    expect(newCatId).not.toBe("oldCatId");
  });

  test("should NOT generate a new cat if within 24-hour period", async () => {
    const withinTwentyFourHours = Timestamp.now().toMillis() - 23 * 60 * 60 * 1000;

    mockedGetLastGeneratedCat.mockResolvedValue({
      lastGeneratedCatId: "oldCatId",
      lastGeneratedTimestamp: withinTwentyFourHours,
    });

    const newCatId = await generateNewCat(mockUid);
    expect(newCatId).toBe("oldCatId");
  });
});
