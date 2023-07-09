import fetch from "node-fetch";
import { parse } from "node-html-parser";
import { createObjectCsvWriter } from "csv-writer";

const VOD_SERVICES = ["netflix", "hbo_max", "canal_plus_manual", "disney"];
const FILE_NAME = "results.csv";

async function fetchTop10MoviesData(vodService) {
  const page_response = await fetch(
    `https://www.filmweb.pl/ranking/vod/${vodService}/film`
  );
  const page_content = await page_response.text();
  const page_dom = parse(page_content);
  const moviesTitleNodes = page_dom.querySelectorAll(".rankingType__title");
  const moviesScoreNodes = page_dom.querySelectorAll(
    ".rankingType__rate--value"
  );
  let top10MoviesData = [];
  for (let i = 0; i < 10; i++) {
    let movieObject = {};
    movieObject.title = moviesTitleNodes[i].firstChild.text;
    movieObject.score = parseFloat(moviesScoreNodes[i].text.replace(",", "."));
    movieObject.vod_service = vodService;
    top10MoviesData.push(movieObject);
  }

  return top10MoviesData;
}

function sortByKey(array, key) {
  return array.sort(function (a, b) {
    var x = a[key];
    var y = b[key];
    return x > y ? -1 : x < y ? 1 : 0;
  });
}

function mergeDeduplicateAndSortMovieArrays(movieDataArrays) {
  let movieDataDict = {};
  for (const movieDataArray of movieDataArrays) {
    for (const movieDataObject of movieDataArray) {
      if (movieDataDict[movieDataObject.title] != undefined) {
        if (
          movieDataObject.score > movieDataDict[movieDataObject.title].score
        ) {
          movieDataDict[movieDataObject.title] = movieDataObject;
        }
      } else {
        movieDataDict[movieDataObject.title] = movieDataObject;
      }
    }
  }

  let deduplicatedMovieData = Object.values(movieDataDict);
  let sortedMovieData = sortByKey(deduplicatedMovieData, "score");

  return sortedMovieData;
}

async function saveMovieDataToCSV(movieDataArray, file_name) {
  const csvWriter = createObjectCsvWriter({
    path: file_name,
    header: [
      { id: "title", title: "Title" },
      { id: "score", title: "Rating" },
      { id: "vod_service", title: "VOD Service" },
    ],
  });

  csvWriter
    .writeRecords(movieDataArray)
    .then(() => console.log("The CSV file was written successfully"))
    .catch((err) => console.log("Failed to write CSV file:", err));
}

async function main() {
  console.log(`Reading top 10 movies from: ${VOD_SERVICES}`);

  let top10MoviesDataPromises = [];
  for (const vodService of VOD_SERVICES) {
    top10MoviesDataPromises.push(fetchTop10MoviesData(vodService));
  }

  const movieDataArrays = await Promise.all(top10MoviesDataPromises);

  const deduplicatedAndSortedMovieData =
    mergeDeduplicateAndSortMovieArrays(movieDataArrays);

  await saveMovieDataToCSV(deduplicatedAndSortedMovieData, FILE_NAME);

  console.log(`Saved the results to ${FILE_NAME}`);
}

await main();
