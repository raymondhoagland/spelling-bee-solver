# NY Times Spelling Bee Solver
## Motivation
Provide a simple script to check for additional words that may have been missed when solving the daily spelling bee.
Using the provided game parameters, perform a lookup on all known matching words.

## Usage
```bash
deno run --allow-net --allow-write search.ts --letters=<letters> --requiredLetter=<center leter> --apiKey=<apiKey> (--output <file>)
```