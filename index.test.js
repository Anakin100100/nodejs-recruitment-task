// Remember to import the functions from your script. In this case, I've assumed that the functions are exported from a module named app.js.
import {
  sortByKey,
  mergeDeduplicateAndSortMovieArrays,
  saveMovieDataToCSV,
} from "./index.js";
import fs from "fs";

describe("sortByKey", () => {
  it("sorts array of objects by given key in descending order", () => {
    const testData = [
      { title: "Movie A", score: 5.0 },
      { title: "Movie C", score: 3.7 },
      { title: "Movie B", score: 4.9 },
    ];
    const result = sortByKey(testData, "score");
    expect(result).toEqual([
      { title: "Movie A", score: 5.0 },
      { title: "Movie B", score: 4.9 },
      { title: "Movie C", score: 3.7 },
    ]);
  });
});

describe("mergeDeduplicateAndSortMovieArrays", () => {
  it("deduplicates, merges and sorts multiple movie data arrays", () => {
    const testData = [
      [
        { title: "Movie A", score: 5.0, vod_service: "netflix" },
        { title: "Movie B", score: 4.0, vod_service: "disney" },
      ],
      [
        { title: "Movie A", score: 3.7, vod_service: "hbo_max" },
        { title: "Movie C", score: 4.9, vod_service: "canal_plus_manual" },
      ],
    ];
    const result = mergeDeduplicateAndSortMovieArrays(testData);
    expect(result).toEqual([
      { title: "Movie A", score: 5.0, vod_service: "netflix" },
      { title: "Movie C", score: 4.9, vod_service: "canal_plus_manual" },
      { title: "Movie B", score: 4.0, vod_service: "disney" },
    ]);
  });
});

describe("saveMovieDataToCSV", () => {
  it("saves the array of movie data objects to disk", async () => {
    const testData = [
      { title: "Movie A", score: 5.1, vod_service: "netflix" },
      { title: "Movie B", score: 4.1, vod_service: "disney" },
    ];

    await saveMovieDataToCSV(testData, "test_file.csv");
    fs.readFileSync("test_file.csv", function (err, data) {
      expect(String(data)).toEqual(
        "Title,Rating,VOD Service\nMovie A,5.1,netflix\nMovie B,4.1,disney\n"
      );
    });

    fs.unlinkSync("test_file.csv", (err) => {
      console.log(`Failed to delete test_file.csv err: ${err}`);
    });
  });
});
