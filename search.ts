// Arg parser
import { parse } from "https://deno.land/std@0.126.0/flags/mod.ts";

/**
 * Search for words containing the required letters
 * @param requiredLetter Letter that must be present in the word
 * @param allowedLetters Other letters that may be used in the word
 * @param apiKey API key to authenticate to word search API
 * @returns List of matching words
 */
async function searchWords(
  requiredLetter: string,
  allowedLetters: string,
  apiKey: string,
) {
  const charMatcher = `[${allowedLetters}]`;

  const queryCriteria = {
    lettersMin: 4,
    letterPattern: `^${charMatcher}*${requiredLetter}${charMatcher}*$`,
  };
  const queryString = Object.entries(queryCriteria).map(([key, value]) =>
    `${key}=${value}`
  ).join(
    "&",
  );

  const searchResponse = await fetch(
    `https://wordsapiv1.p.rapidapi.com/words/?${queryString}`,
    {
      headers: {
        "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
        "X-RapidAPI-Key": apiKey,
      },
    },
  );
  const searchResults = await searchResponse.json();
  return searchResults["results"]["data"];
}

if (import.meta.main) {
  // Parse inputs
  const args = parse(Deno.args);
  const requiredLetter: string = args["requiredLetter"];
  let allowedLetters: string = args["letters"];
  const apiKey: string = args["apiKey"] ||
    Deno.env.get("SPELLING_BEE_SEARCH_API_KEY");
  const output: string = args["output"];

  // Validate required inputs
  if (!requiredLetter || !allowedLetters || !apiKey) {
    throw new Error(
      "Required inputs (--requiredLetter/--letters/--apiKey) not provided.",
    );
  }

  // Required letter can also show up multiple times, include it in the list of characters that can be used
  if (!allowedLetters.includes(requiredLetter)) {
    allowedLetters += requiredLetter;
  }

  // Game input is 7 characters to form words from
  if (allowedLetters.length != 7) {
    throw new Error("Not enough characters supplied.");
  }

  searchWords(requiredLetter, allowedLetters, apiKey).then((wordList) => {
    console.log(wordList);

    if (output) {
      Deno.writeTextFile(output, wordList).then(() => {
        console.log(`Word list saved to ${output}.`);
      });
    }
  });
}
