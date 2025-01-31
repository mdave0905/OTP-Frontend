import CalculateAverageRating from "../helpers/CalculateAverageRating";

describe("CalculateAverageRating", () => {
  it("should return 0.0 for an empty array", () => {
    const ratings = [];
    const result = CalculateAverageRating(ratings);
    expect(result).toBe(0.0);
  });

  it("should return the correct average for valid ratings", () => {
    const ratings = [{ points: 4 }, { points: 5 }, { points: 3 }];
    const result = CalculateAverageRating(ratings);
    expect(result).toBe(4.0);
  });

  it("should handle ratings with decimal points correctly", () => {
    const ratings = [{ points: 3.5 }, { points: 4.5 }, { points: 5 }];
    const result = CalculateAverageRating(ratings);
    expect(result).toBe((3.5 + 4.5 + 5) / 3);
  });

  it("should handle a single rating correctly", () => {
    const ratings = [{ points: 5 }];
    const result = CalculateAverageRating(ratings);
    expect(result).toBe(5.0);
  });
});
